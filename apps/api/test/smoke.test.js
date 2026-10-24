import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
test('StockFlow API source uses JavaScript and exposes health route', async () => {
  const source = await readFile(path.join(here, '../src/app.js'), 'utf8');
  assert.match(source, /api\/health/);
  assert.match(source, /authRequired/);
});
test('Prisma schema defines product and stock movement models', async () => {
  const schema = await readFile(path.join(here, '../../../prisma/schema.prisma'), 'utf8');
  assert.match(schema, /model Product/);
  assert.match(schema, /model StockTransaction/);
});