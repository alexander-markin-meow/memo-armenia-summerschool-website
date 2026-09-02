import assert from 'node:assert/strict';
import test from 'node:test';
import { parseStoredSeed } from './browser-state.ts';

test('accepts only unsigned 32-bit collage seeds', () => {
  assert.equal(parseStoredSeed('0'), 0);
  assert.equal(parseStoredSeed('4294967295'), 4294967295);
  for (const invalid of [null, '', '-1', '1.5', 'NaN', '4294967296', ' 42 ']) {
    assert.equal(parseStoredSeed(invalid), null);
  }
});
