import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const scannableExtensions = /\.(?:css|html|json|md|mjs|ya?ml)$/i;

async function sourceFiles(directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['.git', '.superpowers', 'assets', 'node_modules'].includes(entry.name)) continue;
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) files.push(...await sourceFiles(url));
    else if (scannableExtensions.test(entry.name) && entry.name !== 'site-deployment.test.mjs') files.push(url);
  }
  return files;
}

test('stages every public HTML route in the GitHub Pages artifact', async () => {
  const workflow = await readFile(new URL('.github/workflows/pages.yml', root), 'utf8');
  const stagingStep = workflow.match(/- name: Build a clean Pages artifact[\s\S]*?(?=\n\s+- name:)/)?.[0] ?? '';
  for (const page of ['index.html', 'gift.html', 'navigator.html', 'refund.html']) {
    assert.match(stagingStep, new RegExp(`\\b${page.replace('.', '\\.')}\\b`), `${page} must be staged`);
  }
});

test('documents the public/private fulfilment boundary', async () => {
  const readme = await readFile(new URL('README.md', root), 'utf8');
  assert.ok(readme.includes('公開網站不揭露兌換碼格式、發行分類或私人指南申請入口'));
});

test('keeps Google Form URLs and opaque form IDs out of tracked source material', async () => {
  const googleFormUrl = new RegExp(['docs\\.google\\.com', 'forms'].join('[^\\s]*'), 'i');
  const opaqueGoogleFormId = new RegExp(['1FAIpQL', '[A-Za-z0-9_-]{20,}'].join(''), 'i');
  for (const file of await sourceFiles()) {
    const content = await readFile(file, 'utf8');
    assert.doesNotMatch(content, googleFormUrl, `${file.pathname} contains a Google Form URL`);
    assert.doesNotMatch(content, opaqueGoogleFormId, `${file.pathname} contains an opaque Google Form ID`);
  }
});
