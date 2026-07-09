# Korean Marble Taxonomy v0.1 Localization Plan

## Purpose

Korean Marble Taxonomy v0.1 is a seed implementation for aligning Marble's elementary learning taxonomy to Korea's 2022 revised national curriculum. It is not a full conversion and does not translate the existing English or ELA taxonomy into Korean.

The v0.1 scope is deliberately narrow:

- Priority subjects: elementary Mathematics, Science, and Korean language.
- Source posture: use official curriculum identifiers, source URLs, metadata, and short original paraphrases.
- Legal posture: do not ship verbatim Korean curriculum standard text until license clearance is confirmed.
- Execution posture: keep the seed machine-readable and validate it without changing the original `npm run validate` behavior.

## Source Posture

Primary references for v0.1 are official Korean curriculum portals:

- NCIC main portal: https://ncic.re.kr/
- NCIC domestic curriculum inventory: https://ncic.re.kr/inv/org/list.do
- NCIC 2022 revised curriculum notices: https://ncic.re.kr/bbs/eduNotice2022/list.do
- NCIC copyright policy: https://ncic.re.kr/mbr/policy.do
- Ministry of Education: https://www.moe.go.kr/

NCIC's copyright policy indicates that reuse depends on the marked KOGL status and conditions, including attribution and, for KOGL type 2 materials, non-commercial-only use. Therefore v0.1 treats source standard text as not cleared for redistribution and stores only codes, short paraphrased summaries, links, and metadata.

## Deliverables

The v0.1 seed adds:

- `data/kr/curriculum-standards.seed.json`: compact executable seed for three Korean elementary curricula.
- `data/kr/manifest.json`: counts plus SHA-256 checksums for KR seed files.
- `schema/kr-curriculum-standards.schema.json`: structural contract for the KR seed format.
- `scripts/validate-kr.mjs`: dependency-free integrity validator.
- `npm run validate:kr`: package script for KR validation.

The original files in `data/*.json` are unchanged.

## ID Strategy

Curriculum IDs are stable, human-readable, and namespace-scoped:

- `kr-2022-elem-math`
- `kr-2022-elem-science`
- `kr-2022-elem-korean`

Standard keys use the existing Marble convention:

```text
<curriculum-id>:<official-code>
```

Example:

```text
kr-2022-elem-korean:[2국02-01]
```

Seed micro-topic IDs use a separate KR namespace so they cannot collide with existing `mt_` IDs:

```text
kr.mt.<subject>.<domain>.<topic>.<grade-band>
```

Example:

```text
kr.mt.korean.hangul.decoding.1-2
```

## Subject Design

### Mathematics

The seed covers representative elementary anchors across number and operations, change and relationships, geometry and measurement, and data/probability. The summaries are intentionally short and original. v0.1 is meant to prove the data model and validation path before full standard-by-standard import.

### Science

The seed covers inquiry practices plus representative elementary anchors across motion/energy, matter, life, and Earth/space. Domain placement is provisional and must be reconciled against the official standard text during a licensed import.

### Korean Language

Korean language is modeled as its own subject, not as a translation of English/ELA. The seed explicitly includes:

- Hangul decoding and early literacy.
- Korean grammar and sentence awareness.
- Listening/speaking discourse routines.
- Writing composition.
- Literature response.
- Media literacy.

## Validation Contract

`npm run validate:kr` checks:

- Required top-level counts match array lengths.
- Each curriculum has `textIncluded: false`.
- Each standard key equals `<curriculum-id>:<code>`.
- Official-style KR code format is used for standards.
- Micro-topic IDs use the `kr.mt.` namespace.
- Standard mappings reference existing standards and micro-topics.
- Manifest bytes and SHA-256 hashes match files on disk.

`npm run validate` remains the original dataset validator.

## Roadmap

1. Confirm license terms for official 2022 revised curriculum source text and NCIC exports.
2. Replace provisional paraphrase-only summaries with a cleared source-text policy, if allowed.
3. Expand all three priority subjects across all elementary grade bands.
4. Add reviewed prerequisite edges between KR micro-topics.
5. Decide whether KR topics should remain a regional seed file or be merged into the primary Marble graph.
