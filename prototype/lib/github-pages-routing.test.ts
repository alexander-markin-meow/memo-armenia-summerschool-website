import assert from 'node:assert/strict';
import test from 'node:test';
import { localizedHashRoute, parseHashRoute } from './github-pages-routing.ts';

test('parses only supported collection and project hash routes', () => {
  assert.deepEqual(parseHashRoute(''), { kind: 'collection', locale: 'en' });
  assert.deepEqual(parseHashRoute('#/hy'), { kind: 'collection', locale: 'hy' });
  assert.deepEqual(parseHashRoute('#/ru/projects/iron-nail'), { kind: 'project', locale: 'ru', slug: 'iron-nail' });
  assert.deepEqual(parseHashRoute('#/hy/unknown'), { kind: 'not-found', locale: 'hy' });
  assert.deepEqual(parseHashRoute('#main'), { kind: 'not-found', locale: 'en' });
});

test('preserves project context while changing language', () => {
  const route = parseHashRoute('#/en/projects/iron-nail');
  assert.equal(localizedHashRoute(route, 'hy'), '#/hy/projects/iron-nail');
  assert.equal(localizedHashRoute({ kind: 'collection', locale: 'en' }, 'ru'), '#/ru');
});
