# KR Build Validator Schema Reproducibility Audit

Date: 2026-07-10  
Repo: `/Volumes/data/Dev/os-taxonomy`  
Branch: `kr-full-depth-v0.3`  
Commit: `873124e45f7e8cb3aaa95c3afc6f1b3982e68d6b`  
Scope: read-only audit of current KR taxonomy. The only repo write made by this audit is this file.

## Verdict

No-ship for a curricular/content-correctness release.

Ship is acceptable only as a reproducible structural candidate: the current build is byte-for-byte reproducible and the validators catch basic counts, IDs, references, duplicate IDs/edges, and manifest checksums. They do not prove JSON-schema conformance, DAG acyclicity, source URL validity, verification-status truthfulness, duplicate semantic-topic quality, grade progression, full cluster coverage uniqueness, per-subject quality, or cross-subject edge policy.

## Commands Run

Current validators:

```sh
npm run validate:kr
npm run validate
```

Observed output:

```text
✓ KR full-depth data valid - 11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters. Checksums OK.
✓ valid — 1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.
```

Isolated reproducibility run:

```sh
tmpdir=$(mktemp -d /tmp/os-taxonomy-validator-audit.XXXXXX)
rsync -a --exclude .git --exclude audits /Volumes/data/Dev/os-taxonomy/ "$tmpdir/repo/"
npm run build:kr
npm run validate:kr
npm run validate
```

Temp repo used: `/tmp/os-taxonomy-validator-audit.Nc7VFP/repo`

The isolated `npm run build:kr` output:

```text
Built KR full-depth data: 11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters.
```

Byte-for-byte comparison against the source repo:

```text
data/kr/curriculum-standards.json  cmp=0  sha256=cef106afa6e0efbb7c9a4462a989460827c1828837897adc36ce2ef976c468f4
data/kr/topics.json                cmp=0  sha256=c38b3e7fa86d61cd56d9275786e7132d984da5f3580d7c5c555f876a49eaabfe
data/kr/dependencies.json          cmp=0  sha256=5866730f4302bbd52ab7e24948d69aab338ed36d300d9fb0116a45fe340a7655
data/kr/clusters.json              cmp=0  sha256=be9637c7e4f0b1e4942958c70db744e83d389daa387b8218ed3943d1214a538e
data/kr/manifest.json              cmp=0  sha256=720d383d7d75a1984c963b582718f352eb86230ac3c11d2ef2e5d48b49b9fbf0
```

## Count Reconciliation

The current generated KR files and `data/kr/manifest.json` agree:

```text
sources=21
curricula=11
standards=641
topics=2019
dependencies=2723
clusters=155
standardMappings=2019
coverageGaps=50
workstreams=9
```

The report is stale in two places: `docs/kr-full-depth-integration-report.md:26` says `2722 validated dependency edges`, and `docs/kr-full-depth-integration-report.md:83` shows the old validator output with `2722 dependencies`. Current data has `data/kr/dependencies.json:7` `edgeCount=2723`, and `data/kr/manifest.json:14` `dependencies=2723`.

## Findings

### 1. JSON schemas are not invoked

`package.json:9-13` wires validators directly to `node scripts/validate.mjs` and `node scripts/validate-kr.mjs`; there is no schema-validation dependency or script. `scripts/validate-kr.mjs:2-10` imports only Node core modules and JSON-load helpers.

The current KR schema requires source records to contain `id`, `name`, `url`, and `usage` (`schema/kr-curriculum-standards.schema.json:76-84`). The current data already has two source records without `url` or `usage`:

- `data/kr/curriculum-standards.json:43-51`: `kr-moe-2022-33-annex5-pdf` uses `sourceUrl`, not `url`.
- `data/kr/curriculum-standards.json:76-88`: `kr-ncic-2022-elem-korean-attachment` uses `sourceUrl`, not `url`.

`npm run validate:kr` still passes because `scripts/validate-kr.mjs:40` checks only source count, `scripts/validate-kr.mjs:53` collects `source.id`, and `scripts/validate-kr.mjs:77` checks only that `sourceRefs` point to known IDs.

### 2. Current dependency graph is cyclic

A separate Tarjan SCC pass over `data/kr/dependencies.json` found:

```text
cyclicSccCount=344
cyclicSccNodeTotal=832
largestSccSizes=25, 3, 3, 3, 3, 3, 3, 3, 3, 3
```

Concrete cycle:

```text
kr.mt.math.number-operations.g1-2.s2-01-01.concept
-> kr.mt.math.number-operations.g1-2.s2-01-01.application
-> kr.mt.math.number-operations.g1-2.s2-01-01.representation
-> kr.mt.math.number-operations.g1-2.s2-01-01.concept
```

Evidence:

- `data/kr/dependencies.json:7771-7776`: `representation -> concept`
- `data/kr/dependencies.json:7779-7784`: `application -> representation`
- `data/kr/dependencies.json:16659-16664`: `concept -> application`

`scripts/validate-kr.mjs:122-132` checks endpoint existence, no self-dependency, strength enum, reason, and duplicate pair only. It does not run a DAG/cycle check. The builder also generates within-standard edges at `scripts/build-kr-full-depth.mjs:330-342`, which can collide directionally with workstream-authored dependencies.

### 3. Source URL validity is not enforced

Live checks over the 17 HTTP(S) `url` fields found:

```text
15 reachable with curl GET/HEAD probes
2 returned 404
```

404 records:

- `kr-ncic-2022-notice-543`: `https://ncic.re.kr/bbs/eduNotice2022/view/543.do?searchword=&searchkey=&page=1` (`data/kr/curriculum-standards.json:108-113`)
- `kr-ncic-2026-amendment-notice-1864`: `https://ncic.re.kr/bbs/eduNotice2022/view/1864.do?searchword=&searchkey=&page=1` (`data/kr/curriculum-standards.json:130-135`)

Probe details:

```text
curl -L -I --max-time 12:
  kr-moe: 403 on HEAD, but browser-UA GET returned 200
  kr-ncic-2022-notice-543: 404
  kr-ncic-2026-amendment-notice-1864: 404
  all other HTTP(S) source URLs checked returned 200
```

The validator never fetches or validates URLs. An adversarial temp mutation changing `kr-ncic.url` to `https://example.invalid/os-taxonomy-audit-missing`, then recomputing the manifest checksum, still passed `npm run validate:kr`.

### 4. Verification-status truthfulness is not enforceable

The validator checks only that statuses are members of the enum at `scripts/validate-kr.mjs:17`, `scripts/validate-kr.mjs:39`, `scripts/validate-kr.mjs:64`, and `scripts/validate-kr.mjs:74`. It does not require official-source evidence, URL reachability, local extract hash, citation line, or worker-review artifact for `official-source-checked`.

Adversarial temp mutation:

```text
changed one non-official standard to official-source-checked
sourceBasis="adversarial placeholder: not actually checked"
result: npm run validate:kr PASS
```

This means the validator can preserve the vocabulary of verification while allowing status inflation.

### 5. Duplicate semantic topics are not enforced

Current data has 99 normalized duplicate groups when grouping by `subjectKorean`, `gradeBand`, `domain`, normalized `name`, and normalized `description`.

Sample near-duplicate concept family:

- `data/kr/topics.json:3414-3440`: `kr.mt.art.experience.1-2.001.concept`
- `data/kr/topics.json:3501-3520`: `kr.mt.art.experience.1-2.002.concept`
- Additional group members: `kr.mt.art.experience.1-2.003.concept`, `kr.mt.art.experience.1-2.004.concept`

The sample changes standard/evidence anchor, but repeats the same learner-facing name and description pattern. This may be acceptable as templated decomposition, but it is not adjudicated by the validator.

Adversarial temp mutation:

```text
cloned first topic under id kr.mt.audit.duplicate-semantic-topic
no standardMapping added
updated topicCount and microTopicCount
result: npm run validate:kr PASS with 2020 topics
```

`scripts/validate-kr.mjs:85-107` checks only ID uniqueness and basic field presence for topics. It does not detect duplicate semantic payloads or require every topic to have a standard mapping.

### 6. Grade progression is weakly generated, not validated

The builder has grade-band age defaults at `scripts/build-kr-full-depth.mjs:42-46` and applies them at `scripts/build-kr-full-depth.mjs:196-201`. The current dataset has no `ageRangeStart > ageRangeEnd` cases and no mismatch against those three grade bands in my sample check.

However, the validator does not check age ordering or grade-band progression. Adversarial temp mutation:

```text
topics[0].ageRangeStart=12
topics[0].ageRangeEnd=6
result: npm run validate:kr PASS
```

The KR topic schema only types those fields as integer/null (`schema/kr-topics.schema.json:33-34`) and also cannot express `start <= end`.

### 7. Cluster completeness is not enforced as a global invariant

Current coverage:

```text
unclusteredTopics=0
multiClusterTopics=503
```

Multiple cluster membership may be intentional, but neither uniqueness nor full coverage is a validator invariant. `scripts/validate-kr.mjs:134-140` checks cluster subject, cluster `topicCount`, summaries, and that each listed cluster topic exists. It does not check that every topic appears in at least one cluster, exactly one cluster, or an intended allowed count.

Adversarial temp mutation:

```text
removed the first topic from its cluster while keeping the topic record
updated that cluster's topicCount
result: npm run validate:kr PASS
```

### 8. Per-subject minimum quality is not enforced

Current subject counts:

```text
수학 363
국어 348
과학 306
사회 216
통합교과 144
도덕 120
영어 120
미술 108
음악 108
체육 108
실과(기술·가정)/정보 78
```

The validator enforces only global minimums: `MIN_TOPICS=1500` and `MIN_DEPENDENCIES=2500` at `scripts/validate-kr.mjs:12-13`, then count checks at `scripts/validate-kr.mjs:45-46`. Topic quality checks are presence-oriented: nonempty description, evidence, and prompt at `scripts/validate-kr.mjs:91-96`; `hasEvidence` accepts any nonempty object at `scripts/validate-kr.mjs:25-28`.

Adversarial temp mutation:

```text
collapsed all 78 실과(기술·가정)/정보 topic descriptions/prompts/evidence to "x" placeholders
result: npm run validate:kr PASS
```

### 9. Cross-subject edges are absent and not enforced

Current dependency graph has:

```text
crossSubjectEdges=0
```

If this taxonomy is intended to model only within-subject prerequisite structure, that may be acceptable. If the intended KR taxonomy needs interdisciplinary bridges, the current graph has none. Either way, the validator has no explicit cross-subject edge policy.

### 10. Structural green is not curricular/content green

The KR validator is useful as a structural smoke test:

- declared counts match file lengths
- referenced standard/topic IDs resolve
- duplicate IDs, duplicate mappings, duplicate dependency pairs are rejected
- manifest byte counts and SHA-256 hashes are verified
- English EFL and obvious non-KR social framing guards exist

It does not establish:

- schema conformance
- legal/source URL validity
- exact official-code/text reconciliation
- truthfulness of `official-source-checked`
- duplicate semantic-topic review
- DAG acyclicity
- grade progression quality
- cluster completeness policy
- per-subject minimum quality
- cross-subject edge policy

## Adversarial Temp Tests

All tests were performed in `/var/folders/cp/835jlnfd1cb2zznxzwvx1ld00000gn/T/os-taxonomy-adversarial.KsZYNt`, copied from the isolated temp repo. Each mutation recomputed counts and manifest hashes before running `npm run validate:kr`.

| Mutation | Result |
| --- | --- |
| Clone first topic under a new ID with same semantic payload; add no mapping | PASS, validator reports 2020 topics |
| Change `kr-ncic.url` to `https://example.invalid/os-taxonomy-audit-missing` | PASS |
| Change one non-official standard to `official-source-checked` with placeholder `sourceBasis` | PASS |
| Reverse a topic age range to `12-6` | PASS |
| Remove a topic from its cluster while keeping the topic record | PASS |
| Collapse all Practical Arts/Informatics descriptions, prompts, and evidence to `x` placeholders | PASS |

These are safe false-negative cases because they were made only in temporary copies.

## Recommended Gates Before Ship

1. Add actual JSON Schema validation, preferably with Ajv, for `data/kr/*.json` against `schema/kr-*.schema.json`.
2. Align source-record schema and data: either require `url`/`usage` consistently or update schema to accept `sourceUrl`, `title`, and richer attachment metadata.
3. Add a dependency graph check with explicit policy: DAG required, cycles allowed only with annotated relationship types, or direction semantics renamed.
4. Add source URL validation for HTTP(S) URLs and a separate local-path existence check for `file:` and docs paths.
5. Add verification-status evidence rules, especially for `official-source-checked`.
6. Add duplicate semantic-topic reporting by normalized subject, grade band, domain, name, description, and standard coverage.
7. Add global cluster coverage checks and decide whether multi-cluster topics are allowed.
8. Add per-subject minimum quality thresholds beyond global topic/dependency counts.
9. Decide whether cross-subject edges are required; enforce either zero or a minimum/allowlist policy.
10. Refresh `docs/kr-full-depth-integration-report.md` so dependency counts match the generated data.
