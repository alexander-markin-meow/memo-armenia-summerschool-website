import assert from 'node:assert/strict';
import test from 'node:test';
import { entries, entryBySlug, locales, ui, type LocalizedText } from './content.ts';

function assertLocalized(value: LocalizedText, label: string) {
  for (const locale of locales) {
    assert.ok(value[locale].trim().length > 0, `${label} is missing ${locale} copy`);
  }
}

test('keeps the approved thirty-entry fictional collection complete and addressable', () => {
  assert.equal(entries.length, 30);
  const slugs = new Set<string>();
  for (const entry of entries) {
    assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(slugs.has(entry.slug), false, `duplicate slug: ${entry.slug}`);
    slugs.add(entry.slug);
    assert.equal(entryBySlug(entry.slug), entry);

    assertLocalized(entry.objectName, `${entry.slug}.objectName`);
    assertLocalized(entry.location, `${entry.slug}.location`);
    assertLocalized(entry.approximateDate, `${entry.slug}.approximateDate`);
    assertLocalized(entry.context, `${entry.slug}.context`);
    assertLocalized(entry.project.title, `${entry.slug}.project.title`);
    assertLocalized(entry.project.participant, `${entry.slug}.project.participant`);
    assertLocalized(entry.project.introduction, `${entry.slug}.project.introduction`);
  }
});

test('keeps every interface string available in all three languages', () => {
  for (const [key, value] of Object.entries(ui)) assertLocalized(value, `ui.${key}`);
});
