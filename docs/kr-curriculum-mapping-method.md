# Korean Curriculum Mapping Method

## Scope

This method describes how to map Korea 2022 revised elementary curriculum standards into Korean Marble Taxonomy seed records. It applies to `data/kr/curriculum-standards.seed.json`.

The method is optimized for a license-cautious seed:

- Use official standard codes and source URLs.
- Use short original paraphrases, not copied standard text.
- Keep every mapping reviewable by subject, grade band, domain, and source reference.

## Source Handling

Official source lookup should start with:

- NCIC domestic curriculum inventory: https://ncic.re.kr/inv/org/list.do
- NCIC 2022 revised curriculum notices: https://ncic.re.kr/bbs/eduNotice2022/list.do
- NCIC copyright policy: https://ncic.re.kr/mbr/policy.do
- Ministry of Education: https://www.moe.go.kr/

For each source, record:

- URL.
- Access date.
- Whether full standard text has been cleared for redistribution.
- Whether the source has a KOGL or other explicit reuse marking.
- Any non-commercial, attribution, no-derivatives, or transformation constraints.

If clearance is uncertain, set `textIncluded: false` and do not add verbatim text.

## Standard Record Rules

Each standard record must contain:

- `key`: `<curriculum-id>:<official-code>`.
- `code`: official Korean achievement standard code, such as `[2국02-01]`.
- `gradeBand`: elementary grade band represented by the leading code number.
- `subject` and `subjectKorean`.
- `domain` and `domainKorean`.
- `summary`: one short original paraphrase.
- `sourceTextIncluded: false` until license clearance is confirmed.
- `sourceRefs`: references to source objects in the same seed file.

Do not store:

- Full standard text.
- Long copied explanations from official documents.
- Tables or source excerpts that recreate the official curriculum.

## Micro-Topic Rules

Micro-topics should be teachable units, not broad subject headers. A good KR micro-topic has:

- A stable `kr.mt.` ID.
- One subject and one domain.
- A grade-band range.
- A short Korean title and an English title for interoperability.
- A brief original summary.
- Coverage notes that explain what is intentionally included and excluded.

Korean language micro-topics must reflect Korean-specific literacy. They should include Hangul decoding, syllable block awareness, Korean grammar, discourse, writing, literature, and media literacy where applicable. Do not map Korean language by translating Common Core ELA strands.

## Mapping Rules

Use `standardMappings` to connect standards to micro-topics:

- `standardKey` must resolve to a standard in `curricula[].standards`.
- `microTopicId` must resolve to `microTopics[]`.
- `relationship` should describe the mapping role: `introduces`, `supports`, `extends`, or `assesses`.
- `confidence` should be `seed`, `reviewed`, or `verified`.
- `note` should explain the mapping in one short original sentence.

Use `seed` confidence for v0.1 records unless the mapping has been checked against the official source by a reviewer.

## Review Gates

Before expanding beyond v0.1:

1. Confirm official source URLs and downloadable source artifacts.
2. Confirm license and KOGL markings for each source artifact.
3. Verify all standard codes against official source records.
4. Review paraphrase summaries for accidental source-text copying.
5. Add subject-matter review for Korean language so it remains language-specific rather than ELA-derived.
6. Add prerequisite relationships only after standard-to-topic mappings are reviewed.

## Change Control

When editing the KR seed:

- Update all count fields.
- Run `npm run validate:kr`.
- Update `data/kr/manifest.json` checksums.
- Run `npm run validate` to confirm the original dataset path still passes.
- Keep any full-text import in a separate pull request after licensing is resolved.
