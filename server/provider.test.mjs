import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBalance } from './provider.mjs';
test('balance is remaining quota, not reduced again by usage', () => {
  assert.equal(normalizeBalance({ balance: '100', used: 90 }).remainingTokens, 100);
  assert.equal(normalizeBalance({ quota: { remaining: 0 } }, 'quota.remaining').remainingTokens, 0);
  for (const balance of [null, '', ' ', undefined, 'invalid', false, [], -1, Infinity]) assert.throws(() => normalizeBalance({ balance }));
});
