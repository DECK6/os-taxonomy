# Korean Marble Taxonomy Redesign Plan

## Purpose

Korean Marble Taxonomy is a Korea-first redesign of Marble's elementary learning taxonomy under the 2022 revised Korean national curriculum. It is **not** a translation pass over the English-speaking taxonomy. The target is a curriculum graph whose subjects, grade bands, domains, examples, and prerequisite assumptions match Korean elementary schooling.

Current repository status is an expanded v0.3 candidate seed, not final full coverage. The seed proves the data model, provenance fields, validation path, and subject redesign direction before a complete standard-by-standard import.

## Current v0.3 Scope

The expanded v0.3 candidate seed covers 612 anchors across eleven Korean elementary curriculum areas. It is much deeper than v0.2 but still marks exact code verification as open until a full official-PDF/NCIC pass is complete:

| Curriculum id | Korean subject | Redesign principle |
|---|---|---|
| `kr-2022-elem-korean` | 국어 | Hangul literacy, Korean grammar, discourse, literature, media |
| `kr-2022-elem-math` | 수학 | Korean grade-band sequence and 2022 domain framing |
| `kr-2022-elem-science` | 과학 | Inquiry plus Korean elementary science domains |
| `kr-2022-elem-social-studies` | 사회 | Local community, Korean geography/history/civics |
| `kr-2022-elem-english-efl` | 영어 | English as a foreign language for Korean learners |
| `kr-2022-elem-moral` | 도덕 | Self, relationships, community, coexistence |
| `kr-2022-elem-practical-arts` | 실과 | Life skills, family, technology, information/digital problem solving |
| `kr-2022-elem-integrated` | 통합교과 | 바른 생활, 슬기로운 생활, 즐거운 생활 for grades 1–2 |
| `kr-2022-elem-art` | 미술 | 체험, 표현, 감상, 시각 문화 |
| `kr-2022-elem-music` | 음악 | 표현, 감상, 생활화 |
| `kr-2022-elem-physical-education` | 체육 | 건강, 도전, 경쟁, 표현, 안전 |

## Source Posture

The 2022 revised Korean national curriculum is a public government curriculum source. v0.3 therefore uses official public-document structure as the governing frame and records provenance rather than treating the curriculum as unavailable.

Primary references:

- NCIC main portal: https://ncic.re.kr/
- NCIC domestic curriculum inventory: https://ncic.re.kr/inv/org/list.do
- NCIC 2022 revised curriculum notices: https://ncic.re.kr/bbs/eduNotice2022/list.do
- NCIC copyright/reuse policy: https://ncic.re.kr/mbr/policy.do
- Ministry of Education: https://www.moe.go.kr/

The expanded seed stores concise original summaries and generated micro-topic labels rather than bulk verbatim curriculum text. Records carry `verificationStatus`; current generated anchors are `needs-official-code-check` until a full code-by-code pass is completed against official PDFs/NCIC records.

## Deliverables

- `data/kr/curriculum-standards.seed.json` — expanded standards, embedded micro-topic, mapping, and coverage seed.
- `data/kr/topics.seed.json`, `dependencies.seed.json`, `clusters.seed.json` — graph nodes, soft prerequisite edges, and parent-facing clusters.
- `data/kr/manifest.json` — counts and checksums for KR seed files.
- `schema/kr-curriculum-standards.schema.json` — JSON Schema for the expanded staged seed.
- `scripts/validate-kr.mjs` — dependency-free integrity validator.
- `docs/kr-curriculum-mapping-method.md` — source and mapping rules.
- `docs/kr-subject-redesign-notes.md` — per-subject redesign rationale.

## Completion Criteria for a Future Full Release

A full Korean release requires:

1. Download or mirror the official 2022 revised curriculum artifacts used for each subject.
2. Verify every achievement-standard code and grade band against the public source.
3. Expand beyond representative anchors to full elementary coverage.
4. Review subject-specific micro-topic decomposition with Korean curriculum specialists.
5. Build prerequisite edges after standards and topics are stable.
6. Decide whether Korean topics remain in `data/kr/` or become a merged regional graph.

## Non-goals for v0.3

- It does not claim full coverage.
- It does not claim every code has been officially checked.
- It does not reuse the English/ELA or History taxonomy as a source of truth.
- It includes generated soft prerequisite edges, but not a fully reviewed expert dependency graph.
