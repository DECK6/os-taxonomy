# KR v0.4 final verification

Date: 2026-07-10
Kanban task: `t_aaef893a`
Reviewed range: `kr-full-depth-v0.3..kr-full-depth-v0.4-improved` plus the narrow fixes recorded below
Repository: `os-taxonomy`

## Verdict

**PASS — technical gates are green after narrow generator and validator fixes; push remains pending final review approval.**

The final tree rebuilds deterministically, passes all canonical and adversarial checks, preserves exact reviewed inventories for all 11 curricula, has a clean prerequisite DAG, and contains no known placeholder, exact semantic-duplicate, evidence, prompt-within-standard, schema, checksum, or source-link failures.

## Scope reviewed

- Full commit and file diff from `kr-full-depth-v0.3` through the current v0.4 release tree.
- All nine KR root workstreams and every generated `data/kr` artifact.
- Official inventory snapshots, source fingerprints, direct source groups, item locators, record-level verification statuses, and rights posture.
- Topic content quality, learner-observable evidence, assessment prompts, semantic duplication, Korean surface text, graph topology, cluster coverage, schemas, checksums, and clean-build reproducibility.
- Manual topic sampling across every subject, with additional sampling for 사회, 영어 EFL, 미술, 음악, and 체육.

## Blocking defects found and fixed

### 1. Social/arts/PE learner-facing text contained literal `undefined`

The social/arts/PE builder converted an inventory standard into its published standard shape, then passed that reduced object to facet templates that still read internal `focus` and `unitName` fields. This produced 450 affected topics:

- 사회: 147
- 미술: 78
- 음악: 78
- 체육: 147

The defect appeared in descriptions, evidence, and prompts and escaped the prior gate because the strings were non-empty and schema-valid.

Fix:

- Added an explicit published-standard-to-template context adapter in `scripts/build-social-arts-pe-workstreams.mjs`.
- Added a content gate for literal `undefined` in Korean-facing fields.
- Added a targeted adversarial validator test and a workstream regression test requiring each topic to retain its standard focus and a topic-specific prompt.

### 2. Korean surface text had unresolved or fixed-particle regressions

Manual sampling exposed direct-josa and repeated-token defects in 국어, 통합교과, 도덕, 실과, and EFL, including `의사소통와`, `생활하기이`, `돌봄를`, unresolved `과/와`, `개념를`, and repeated `말하기 말하기` / `수행 수행` forms.

Fix:

- Extended the deterministic josa resolver to support `과/와`.
- Replaced fixed-particle generator templates with resolvable placeholders.
- Reconstructed practical-arts and moral prompts from standard metadata with `attachJosa`.
- Corrected the generic conceptual prompt and duplicate-token repair path.
- Added canonical workstream regression checks for the observed defect classes.

All generated and workstream content now reports zero unresolved josa, zero known malformed forms, and zero literal `undefined` placeholders.

### 3. Topic verification status accepted learner evidence as source evidence

A targeted adversarial fixture changed a `public-doc-derived` topic to `official-source-checked`, removed every source locator and provenance field, and left only learner mastery evidence. The validator incorrectly passed because its shared verification predicate treated `evidence[]` as source-verification evidence.

Fix:

- Added a topic-specific verification predicate that accepts only locator, provenance, source-evidence, or verification-note fields.
- Added an adversarial regression test proving that topic status inflation without source provenance is rejected.
- Rechecked the canonical corpus: all 1,257 `official-source-checked` topics retain accepted provenance, including all 789 topics that intentionally omit a repeated top-level `sourceLocator`.

### 4. Official locator, grade-band, and manifest completeness checks had false greens

Independent adversarial fixtures reproduced three additional validator gaps:

- An official standard code such as `[4사01-01]` could be assigned the wrong `gradeBand` while checksums still passed.
- A code-only evidence string could satisfy the item-level official-source locator gate after its source id, attachment, hash, page, and structured locator were removed.
- A tracked KR workstream could be omitted from `manifest.files`, allowing the validator to ignore that file and still report checksums OK.

Fix:

- Cross-check official standard grade bands against their `[2|4|6...]` code family and topic grade bands against mapped standards.
- Require a structured locator or a source-specific legacy locator carrying the expected source, attachment/hash anchors where applicable, page/section signal, and exact code.
- Compare the complete recursive `data/kr/**/*.json` file set against `manifest.files` in both directions before checksum validation.
- Added one adversarial regression test for each false green.

### 4. Official standard grade-band drift was checksum-valid

An adversarial fixture changed social standard `[4사01-01]` from grade band `3-4` to `1-2`, refreshed the manifest checksum, and the previous validator returned success.

Fix:

- Cross-check every standard's leading code digit (`2`, `4`, or `6`) against grade band (`1-2`, `3-4`, or `5-6`).
- Cross-check each topic's grade band against every mapped standard.
- Added an adversarial regression test that requires the mutated social standard to fail.

### 5. Code-only evidence could masquerade as an official item locator

The previous locator predicate accepted any evidence text containing the standard code. Removing the social standard's source id, attachment number, hash, page, and locator while retaining `Official code [4사01-01] reviewed` still passed.

Fix:

- Structured locator objects now must match the direct source id, attachment number, source SHA-256, PDF page, and exact standard code.
- Evidence-object locators must bind the expected direct source id, a nontrivial PDF/line/section locator, and the exact code.
- Legacy Korean and base integrated records require a source section, exact code, and source-specific attachment or annex marker together.
- Added an adversarial regression test proving code-only evidence is rejected.

### 6. Manifest completeness was not enforced

Deleting `workstreams/social.json` from `manifest.files` and mutating the omitted file passed because only listed entries were checked.

Fix:

- Recursively enumerate every JSON artifact under `data/kr`, excluding `manifest.json` itself.
- Require exact bidirectional equality between the on-disk artifact set and `manifest.files` before validating bytes and hashes.
- Added an adversarial regression test for an omitted social workstream entry.

## Final dataset metrics

| Metric | Result |
|---|---:|
| Source records | 17 |
| Curricula | 11 |
| Standards | 620 |
| Topics | 1,956 |
| Standard mappings | 1,956 |
| Dependencies | 1,894 |
| Clusters | 153 |
| Coverage gaps | 43 |
| Root workstreams | 9 |

Verification status:

- Standards: 620 `official-source-checked`
- Topics: 1,257 `official-source-checked`; 699 `public-doc-derived`
- Official standards missing accepted verification evidence: 0

## Graph and cluster integrity

- Missing dependency endpoints: 0
- Self edges: 0
- Duplicate directed pairs: 0
- Reciprocal pairs: 0
- Cyclic SCCs: 0
- Topics in cyclic SCCs: 0
- Cross-subject edges: 0
- Later-age prerequisites: 0
- Integration-builder fallback edges: 0
- Generated padding edges: 0
- Weak components: 183
- Roots with no prerequisite: 190
- Leaves unlocking no later topic: 191
- Unclustered topics: 0
- Multi-cluster topics: 503
- Maximum memberships for one topic: 3

The graph policy remains an explicit reviewed prerequisite DAG with no cross-subject edges.

## Content, evidence, and prompt integrity

Canonical `data/kr/topics.json` and the nine workstreams both report:

- Unresolved josa placeholders: 0
- Known malformed Korean forms: 0
- English facet leakage in Korean-facing fields: 0
- Literal `undefined` placeholders: 0
- Exact semantic duplicate groups/records: 0 / 0
- Topics with fewer than two learner-observable evidence criteria: 0
- Non-observable evidence items mixed into mastery evidence: 0
- Duplicate prompt groups/records within one standard: 0 / 0
- Exact duplicate names: 0 groups
- Exact duplicate descriptions: 0 groups

The near-duplicate scan found 176 pairs at token-Jaccard `>= 0.90`. The ten highest-scoring pairs were manually reviewed. They are parallel but distinct official standards or facet decompositions, such as animal-versus-plant design standards and different physical-education sport families; none is an exact duplicate or a merge candidate without collapsing official lineage.

There are 78 exact prompt groups covering 222 records globally, all in mathematics. They are shared module-level rubric templates across distinct official codes and are not duplicates within one standard. Code, standard mapping, source locator, topic name, and evidence lineage remain distinct. This is recorded as template reuse, not silent record corruption.

## Official inventory, source, and rights integrity

All 11 official inventory gates passed exact count, code digest, direct official source-group, and structured item-locator checks:

- 국어 87
- 수학 121
- 과학 102
- 사회 49
- 영어 40
- 도덕 24
- 실과 39
- 통합교과 57
- 미술 26
- 음악 26
- 체육 49

Source checks:

- Normalized source-field failures: 0
- Stale aliases: 0
- Stale NCIC notice routes: 0
- Official PDF snapshot mismatches: 0
- Live HTTP checks: 13 unique URLs reachable for 17 source records
- Schema validation: all four Draft 2020-12 KR documents valid with zero errors
- `npm audit`: 0 vulnerabilities

A total of 789 official-source-checked topics do not repeat a top-level `sourceLocator`; they carry accepted `provenanceEvidence` or source-section evidence instead. All 620 standards retain a direct official source group and satisfy the stricter structured-object, evidence-object, or legacy composite item-locator contract. No record is untraceable under the current validator contract.

Work-level reuse remains correctly conservative: **HOLD pending work-specific KOGL and commercial-use evidence.** This audit makes no broader copyright or redistribution claim.

## Manual sampling

A deterministic sample covered every subject, with three records each for the priority areas 사회, 영어 EFL, 미술, 음악, and 체육. Focused post-fix rechecks included:

- `kr.mt.korean.listening-speaking.5-6.6guk0103.01`
- `kr.mt.practical.human-development-self-directed-life.5-6.0103.practice`
- `kr.mt.english-efl.5-6.expression.6영02-01.01.강세-살려-문장-말하기`
- `kr.mt.integrated.right-life.who.2ba0102.01`
- `kr.mt.integrated.joyful-life.who.2jeul0102.01`
- `kr.mt.moral.self-agency.g3-4.4do-01-01.concept`
- `kr.mt.social.3-4.4sa0902.concept`
- `kr.mt.art.3-4.4mi0202.reflect`
- `kr.mt.music.3-4.4eum0104.perform`
- `kr.mt.physical-education.5-6.6che0205.understand`

The rechecks confirmed subject-appropriate framing, standard-specific focus, learner-observable evidence, prompt/evidence alignment, Korean EFL framing, Korea-first social context, and corrected Korean surface forms.

## Executed verification

Canonical tree:

- `npm run build:kr` — pass; idempotent working-tree diff
- `node --test tests/*.test.mjs` — 37/37 pass
- `npm run test:kr` — 27/27 pass
- `npm run check:kr:content` — pass
- `npm run validate:kr` — pass, checksums OK
- `npm run validate` — pass, repository referential integrity and checksums OK
- `npm run check:kr:links` — pass, all 13 unique HTTP(S) endpoints reachable
- `npm audit --audit-level=low` — 0 vulnerabilities
- `git diff --check` — pass

Isolated reproduction:

1. Cloned the branch into `/tmp/os-taxonomy-t_aaef893a-repro-final`.
2. Applied the exact uncommitted review patch to the clean clone.
3. Ran `npm ci --ignore-scripts`.
4. Ran the full KR build, all 37 tests, and `validate:kr`.
5. Compared every tracked file under `data/kr` against the canonical working tree.

Result: **18/18 tracked KR artifacts byte-identical; 0 mismatches.**

Final `data/kr/manifest.json` SHA-256: `855b7ac7b522d57feddfca540cc2fb1366a9e0d9a7b7222887451328f3e4738b`.

## Remaining non-blocking review notes

1. The 176 near-duplicate pairs are intentional parallel template families under distinct standards, but future subject-expert enrichment may make their differences more pedagogically explicit.
2. Mathematics has global prompt-template reuse across distinct codes; the validator correctly blocks duplicates within a single standard, not intentional cross-standard rubric reuse.
3. Topic-level source evidence is structurally mixed between `sourceLocator`, `sourceSection`, and `provenanceEvidence`; this is accepted and traceable, but a later schema revision could normalize it for downstream consumers.
4. Rights posture remains HOLD until work-specific KOGL/commercial-use evidence exists.
5. Generator regressions are covered by the mandatory build-then-test release sequence; the JSON-reading regression tests do not invoke every builder as standalone test setup.

No remaining automated integrity gate is failing. Remote push remains intentionally paused until the repair commit receives final review approval.
