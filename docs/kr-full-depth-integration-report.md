# KR Full-Depth Integration Report

Generated from `data/kr/workstreams/*.json` by `npm run build:kr`.

## Coverage

| Subject | Standards | Topics |
| --- | ---: | ---: |
| 국어 | 87 | 348 |
| 수학 | 121 | 363 |
| 과학 | 102 | 306 |
| 사회 | 72 | 216 |
| 영어 EFL | 40 | 120 |
| 도덕 | 24 | 120 |
| 실과(기술·가정)/정보 | 39 | 78 |
| 통합교과 | 48 | 144 |
| 미술 | 36 | 108 |
| 음악 | 36 | 108 |
| 체육 | 36 | 108 |
| **Total** | **641** | **2019** |

The integrated KR files meet the topic-depth target and publish only reviewed dependency suggestions:

- `data/kr/curriculum-standards.json`: 11 curricula, 641 achievement-standard anchors, 2019 standard-to-topic mappings, 50 documented coverage gaps.
- `data/kr/topics.json`: 2019 KR micro-topics. Every topic has `evidence[]`, `assessmentPrompt`, Korean subject metadata, grade-band context, and standard references.
- `data/kr/dependencies.json`: 2081 workstream-authored dependency edges. The graph is a DAG with zero reciprocal pairs and no target-padding or deterministic integration-builder edges.
- `data/kr/clusters.json`: 155 clusters. Each cluster includes `summary` and `parentSummary` for parent-facing explanations.
- `data/kr/manifest.json`: SHA-256 and byte counts for every KR JSON data file except the manifest itself, including generated full files, seed files, and workstream artifacts.

Cluster coverage is explicitly `at-least-one`; multiple pedagogical memberships are allowed. Source records use normalized `name`, `url`, `accessDate`, and `usage` fields. Offline validation checks URL syntax and repository-local file existence without making builds depend on the network.

## Source Posture

The integration preserves record-level verification status:

- `official-source-checked`: subject workers checked official NCIC/MOE source documents or inventories for the record.
- `public-doc-derived`: record is derived from the public curriculum source posture but remains less direct than line-level official verification.
- `needs-official-code-check`: candidate records are useful for graph depth but must be reconciled with exact official code/text before final canonical release.

Official standard text is not reproduced. Records store codes, source references, source-derived paraphrases, evidence notes, and assessment prompts.

## Subject Rules

- English remains Korean learner EFL: `subject` is `English as a Foreign Language`, and the KR validator rejects native ELA framing.
- Social studies remains Korea-centered: validator checks for obvious US/UK default framing in social topic text.
- Arts and PE are integrated from the 예체능 workstream but split into first-class curricula for 미술, 음악, and 체육.
- Practical Arts/Informatics replaces the old seed posture with 39 official-source-grounded standards across five domains, including digital society and AI.

## Remaining Gaps

The merged file records 50 coverage gaps:

| Area | Gap Count |
| --- | ---: |
| 미술·음악·체육 | 4 |
| 영어 | 7 |
| 통합교과 | 5 |
| 국어 | 4 |
| 수학 | 5 |
| 도덕 | 7 |
| 실과(기술·가정)/정보 | 4 |
| 과학 | 6 |
| 사회 | 8 |

High-value follow-up work:

- Reconcile `needs-official-code-check` records against official NCIC PDF/HWP code lines before final release.
- Add teacher-reviewed rubrics and level descriptors beyond the current assessment prompts.
- Continue subject-expert review of workstream-authored dependency edges before promoting the candidate graph to canonical status.
- Build reviewed example banks for Korean local community, Korean history/civics/culture, and Korean classroom EFL contexts.

## Validation

Required commands:

```sh
npm run build:kr
npm run validate:kr
npm run test:kr
npm run validate
```

Optional live source-link check (kept separate from deterministic validation):

```sh
npm run check:kr:links
```

Current green result:

```text
✓ KR full-depth data valid - 11 curricula, 641 standards, 2019 topics, 2081 dependencies, 155 clusters. Checksums OK.
✓ valid — 1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.
```
