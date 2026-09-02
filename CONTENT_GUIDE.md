# Replacing prototype content safely

The current thirty entries are fictional. Do not partially rewrite them as if they were verified records.

## Before adding a real entry

Confirm and record:

- participant consent and whether their real name or a pseudonym should appear;
- interviewee consent when a project includes local testimony;
- permission to publish every photograph, text, audio clip, and video;
- whether the find location can safely be public;
- the preferred credit line and spelling in English, Armenian, and Russian;
- whether the object date and provenance are verified, approximate, or unknown;
- any restriction on embedding, downloading, or reusing the material.

## Entry format

Edit `prototype/lib/content.ts`. Every entry needs:

- a stable lowercase slug;
- one of the six supported shape placeholders, or later a reviewed cut-out image;
- object name, location, date wording, and context in all three languages;
- project title, participant display name, medium, and introduction in all three languages;
- meaningful alt text for every future content image.

Keep URL identifiers in English-like stable IDs; never generate filters or links from translated labels.

## Review sequence

1. Add the real record on a separate branch.
2. Verify all rights and consent notes outside the public site repository.
3. Have fluent speakers review Armenian and Russian wording.
4. Check phone and desktop layouts, keyboard use, and image descriptions.
5. Approve the entry for publication, then merge it to `main`.

Never commit consent forms, private contact details, unpublished interviews, API keys, or unredacted source files to this repository.

## Research/process page

The research page is a separate editorial record, not a second catalogue. Keep its sections in `prototype/lib/content.ts` and its presentation in `prototype/components/ResearchResults.tsx`. It may connect projects, interviews, ideas, concepts, experiments, and trials, but every real extract still needs the same consent, attribution, translation, and sensitivity review as a project entry. Unfinished or unapproved material should remain a clearly labelled prototype placeholder.
