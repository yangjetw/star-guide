import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

test('defines the zero-install static site package contract', async () => {
  assert.ok(existsSync(new URL('package.json', root)), 'package.json must exist');
  const packageJson = JSON.parse(
    await readFile(new URL('package.json', root), 'utf8'),
  );

  assert.deepEqual(packageJson, {
    name: 'parent-star-guide',
    version: '1.0.0',
    private: true,
    scripts: { test: 'node --test' },
  });
});

test('defines the Traditional Chinese HTML page contract', async () => {
  assert.ok(existsSync(new URL('index.html', root)), 'index.html must exist');
  assert.ok(existsSync(new URL('styles.css', root)), 'styles.css must exist');
  const html = await readFile(new URL('index.html', root), 'utf8');
  const css = await readFile(new URL('styles.css', root), 'utf8');

  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html\s+lang=["']zh-Hant["']>/i);
  assert.match(html, /<meta\s+charset=["']UTF-8["']\s*\/?>/i);
  assert.match(
    html,
    /<meta\s+name=["']viewport["']\s+content=["']width=device-width, initial-scale=1["']\s*\/?>/i,
  );
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']\s*\/?>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
  assert.match(html, /<h1>[^<]+<\/h1>/i);
  assert.ok(css.trim(), 'styles.css must contain a minimal stylesheet');
});
