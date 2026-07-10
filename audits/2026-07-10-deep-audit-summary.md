# KR Taxonomy Deep Audit Summary and Release Verdict

Date: 2026-07-10  
Repository: `/Volumes/data/Dev/os-taxonomy`  
Branch: `kr-full-depth-v0.3`  
Commit audited: `873124e45f7e8cb3aaa95c3afc6f1b3982e68d6b`  
Task: `t_7df57d82`  
Posture: independent read-only synthesis and high-severity spot re-verification. This report is the only file created by this task.

## Executive Verdict

**Release classification: NO-GO.**

The current KR taxonomy is reproducible as a generated artifact and passes its repository smoke tests. It is **not canonical-ready** and must not be released as complete, current, curriculum-correct, teacher-ready, learner-ready, prerequisite-DAG-safe, or commercially cleared Korean 2022 revised-curriculum data.

A copy may remain **candidate-only** for internal remediation if all of the following labels travel with it:

- non-canonical generated research candidate;
- not a prerequisite DAG;
- not subject-expert validated;
- incomplete against the current accessible curriculum amendment;
- not cleared for general or commercial redistribution.

This is not a marginal quality decision. Four independent release blockers are sufficient on their own:

1. The standard layer contains **92 dataset-only base-2022 codes** and omits **62 base-2022 official codes**; the current amendment raises the official-only gap to **71**.
2. The dependency graph contains **344 cyclic strongly connected components covering 832 of 2,019 topics**.
3. The learner-facing topic layer contains widespread duplicate/generated filler and malformed Korean, including **1,152 records with unresolved particle placeholders**.
4. Korean source rights and attribution are not established at the work level; the repository has no KR section in `PROVENANCE.md`, while the live NCIC policy requires checking the applicable work-level KOGL mark and conditions.

## Release Classification

| Classification | Result | Reason |
|---|---|---|
| `canonical-ready` | **No** | Official code/meaning mismatches, omitted amendment, cyclic graph, and unreviewed content are incompatible with a canonical curriculum taxonomy. |
| `candidate-only` | **Conditional internal use only** | The build is deterministic and the corpus can be used as remediation input if its limitations are explicit and DAG/curriculum consumers are blocked. |
| `no-go` | **Final public/general release verdict** | Critical provenance, curricular, graph, content, and licensing gates are open. |

## Scope, Evidence Standard, and Limits

This synthesis read all five completed parent reports and their full named artifacts, then independently checked their highest-severity claims against the repository and, for the disputed code inventories, the cited official NCIC PDFs.

The audit does **not** claim:

- Korean curriculum subject-expert validation;
- legal advice or a final copyright determination;
- classroom calibration, learner testing, accessibility review, or regional representativeness;
- a new byte-for-byte build reproduction beyond the isolated reproduction already recorded by the validator parent audit.

The official-source comparison establishes code inventory and obvious code-to-meaning collisions. It does not replace a line-by-line subject-specialist reconstruction of all standards and topics.

## Parent Audit Evidence Map

| Parent task | Artifact | Principal evidence used here |
|---|---|---|
| `t_de6c2ad4` — official source and provenance | [`audits/2026-07-10-source-provenance-audit.md`](./2026-07-10-source-provenance-audit.md) | [Full official-PDF code results](./2026-07-10-source-provenance-audit.md#full-official-pdf-code-results), [semantic sample](./2026-07-10-source-provenance-audit.md#semantic-and-provenance-sample-results), [source-record audit](./2026-07-10-source-provenance-audit.md#every-source-record-inspected), and [licensing findings](./2026-07-10-source-provenance-audit.md#licensing-and-provenance-findings). |
| `t_b90ad670` — validator and reproducibility | [`audits/2026-07-10-validator-repro-audit.md`](./2026-07-10-validator-repro-audit.md) | [Count reconciliation](./2026-07-10-validator-repro-audit.md#count-reconciliation), [false-green findings](./2026-07-10-validator-repro-audit.md#findings), and [adversarial temp tests](./2026-07-10-validator-repro-audit.md#adversarial-temp-tests). |
| `t_5b5876d3` — prerequisite graph | [`audits/2026-07-10-graph-audit.md`](./2026-07-10-graph-audit.md) | [DAG result](./2026-07-10-graph-audit.md#dag-result), [components/roots/leaves](./2026-07-10-graph-audit.md#components-roots-and-leaves), and [target-padding assessment](./2026-07-10-graph-audit.md#target-padding-assessment). |
| `t_889b38c6` — topic quality | [`audits/2026-07-10-topic-quality-audit.md`](./2026-07-10-topic-quality-audit.md) | [Exact duplicates](./2026-07-10-topic-quality-audit.md#1-exact-duplicate-topics-create-false-proliferation), [malformed Korean](./2026-07-10-topic-quality-audit.md#3-malformed-korean-is-widespread), [evidence semantics](./2026-07-10-topic-quality-audit.md#5-evidence-is-provenance-not-observable-mastery-evidence), and [traceability](./2026-07-10-topic-quality-audit.md#6-source-traceability-is-incomplete). |
| `t_50fa13c7` — EFL and social context | [`audits/2026-07-10-efl-social-context-audit.md`](./2026-07-10-efl-social-context-audit.md) | [Critical findings](./2026-07-10-efl-social-context-audit.md#critical-findings), [EFL fit](./2026-07-10-efl-social-context-audit.md#efl-fit), [Korea-first social fit](./2026-07-10-efl-social-context-audit.md#korea-first-fit), and [validator limits](./2026-07-10-efl-social-context-audit.md#validator-vs-content-correctness). |

## What Previous Validation Actually Proved

The following commands pass on the audited branch:

```sh
npm run validate:kr
npm run validate
```

Observed output:

```text
✓ KR full-depth data valid - 11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters. Checksums OK.
✓ valid — 1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.
```

The isolated build in the [validator/reproducibility parent report](./2026-07-10-validator-repro-audit.md#commands-run) regenerated all five KR artifacts byte-for-byte and matched their recorded SHA-256 hashes. That is meaningful evidence for determinism.

The current validator proves:

- declared top-level counts equal array lengths;
- standard, topic, mapping, dependency, and cluster identifiers resolve;
- topic IDs and dependency pairs are unique;
- dependencies have valid endpoints, are not self-edges, and contain a reason;
- manifest byte sizes and SHA-256 checksums match current files;
- the configured global minima of 1,500 topics and 2,500 dependencies are met;
- English topics use the `English as a Foreign Language` subject label;
- social text avoids four explicit foreign-default strings.

## What Previous Validation Did Not Prove

The current validator does not prove:

- JSON Schema conformance; `package.json:9-12` invokes custom Node validators, not the schemas;
- whether a code exists in an official curriculum document;
- whether a summary matches the official meaning of that code;
- whether current amendments are represented;
- whether `official-source-checked` has item-level evidence;
- source URL reachability or work-level license/attribution conditions;
- DAG acyclicity, reciprocal-pair absence, or pedagogical edge direction;
- semantic topic uniqueness, distinct facets, natural Korean, or observable mastery evidence;
- grade progression, full cluster policy, subject-level quality, or cross-subject graph policy.

Concrete false greens already present in the current corpus:

- `schema/kr-curriculum-standards.schema.json:78` requires source `id`, `name`, `url`, and `usage`, but 6 of 21 source records fail that requirement while `npm run validate:kr` passes.
- `scripts/validate-kr.mjs:122-132` checks dependency endpoints, self-edges, strength, reasons, and duplicate pairs, but never checks cycles.
- `scripts/validate-kr.mjs:18` accepts synthetic-looking `[2미..]`, `[2음..]`, and `[2체..]` codes while rejecting the current official `[2건..]` family because `건` is absent from the regex.
- `scripts/validate-kr.mjs:25-28` accepts any non-empty evidence object, so all 2,019 provenance-only evidence objects pass as if they were learner evidence.

## Consolidated Quantified Findings

### Baseline integrity

| Metric | Result |
|---|---:|
| Curricula | 11 |
| Standards | 641 |
| Topics | 2,019 |
| Dependencies | 2,723 |
| Clusters | 155 |
| Source records | 21 |
| Standard mappings | 2,019 |
| Missing dependency endpoints | 0 |
| Self dependencies | 0 |
| Duplicate directed dependency pairs | 0 |
| Current validator result | PASS |
| Isolated deterministic rebuild | PASS in parent audit |

These are structural positives. They do not change the release verdict.

### Content quality

| Finding | Count |
|---|---:|
| Exact duplicate `name` groups / records | 99 / 324 |
| Exact duplicate `titleKorean` groups / records | 99 / 324 |
| Exact duplicate `description` groups / records | 99 / 324 |
| Duplicate assessment-prompt groups / records | 209 / 642 |
| Topics with unresolved Korean particle placeholders | 1,152 |
| Korean-facing topics with English facet labels | 324 |
| Topics whose sole evidence type is `source-to-topic-decomposition` | 2,019 / 2,019 |
| Topics missing `sourceLocator` | 1,671 |
| `official-source-checked` topics missing `sourceLocator` | 909 |
| Topics missing `generationBasis` | 1,527 |
| Topics with empty verification status | 324 |

Representative learner-facing failures in `data/kr/topics.json`:

- `kr.mt.korean.listening-speaking.1-2.2guk0101.01` (`data/kr/topics.json:10`) contains `듣기·말하기을/를`, `의사소통을/를`, and `이/가`.
- `kr.mt.art.experience.1-2.001.concept` (`data/kr/topics.json:3414`) uses the Korean-facing title `미술 체험 1-2 concept` and duplicates later anchors.
- `kr.mt.integrated.right-life.who.2ba0101.01` (`data/kr/topics.json:4458`) belongs to a standard whose three facets share the same assessment prompt.
- `kr.mt.practical.human-development-self-directed-life.5-6.0101.concept` (`data/kr/topics.json:60370`) contains malformed forms including `조건와` and `존중를`.

### Provenance and official-source alignment

| Finding | Result |
|---|---:|
| `official-source-checked` standards | 461 |
| `needs-official-code-check` standards | 180 |
| Base-2022 official-code intersection | 549 / 641 (85.65%) |
| Base-2022 dataset-only codes | 92 / 641 (14.35%) |
| Base-2022 official-only codes | 62 |
| Current official-only codes after amended Annex 15 | 71 |
| Deterministic semantic/provenance sample | 175 / 641 |
| Sample verdicts | 125 PASS / 1 PARTIAL / 49 FAIL |
| Source records failing their JSON Schema required fields | 6 / 21 |
| Stored HTTP(S) source URLs returning 404 in the parent live check | 2 |
| Candidate-status sample records with a direct subject-PDF source | 0 / 50 |

Positive evidence worth preserving: all 461 records labeled `official-source-checked` have code strings present in their cited base-2022 PDFs, and the 125 sampled official-status records passed the parent semantic/source-reference check. This does not cure the candidate-subject failures or the current-amendment gap.

Official code-set differences independently reproduced from the cited NCIC PDFs:

| Subject | Dataset | Official base | Intersection | Dataset-only | Official-only |
|---|---:|---:|---:|---:|---:|
| 사회 | 72 | 49 | 27 | 45 | 22 |
| 미술 | 36 | 26 | 24 | 12 | 2 |
| 음악 | 36 | 26 | 24 | 12 | 2 |
| 체육 | 36 | 49 | 13 | 23 | 36 |
| **Subtotal** | **180** | **150** | **88** | **92** | **62** |

The current amended integrated-subject PDF, NCIC attachment `10004214`, contains 57 codes: 16 `바`, 16 `슬`, 9 `건`, and 16 `즐`. The nine omitted codes are:

```text
[2건01-01] [2건01-02]
[2건02-01] [2건02-02] [2건02-03] [2건02-04] [2건02-05]
[2건03-01] [2건03-02]
```

### Dependency graph

| Metric | Result |
|---|---:|
| All edges | 2,723 |
| Cyclic SCCs | 344 |
| Topics in cyclic SCCs | 832 |
| Cyclic SCC size distribution | 222 size-2; 121 size-3; 1 size-25 |
| Direct reciprocal pairs | 222 |
| Cross-subject edges | 0 |
| Weak components | 61 |
| Roots / leaves | 64 / 49 |
| `integration-builder` edges | 642 |
| Graph without `integration-builder` | 2,081 edges; 0 cyclic SCCs |

The generator is the causal boundary, not merely a correlation. All cycles disappear when `integration-builder` edges are removed. `scripts/build-kr-full-depth.mjs:330-341` adds 541 hard lexical within-standard edges, and `scripts/build-kr-full-depth.mjs:345-355` adds 101 soft cluster-adjacency edges. These overlays conflict with workstream-authored directions.

Representative cycle:

```text
kr.mt.math.number-operations.g1-2.s2-01-01.concept
-> kr.mt.math.number-operations.g1-2.s2-01-01.application
-> kr.mt.math.number-operations.g1-2.s2-01-01.representation
-> kr.mt.math.number-operations.g1-2.s2-01-01.concept
```

The current 2,500-edge minimum therefore rewards density over correctness. The acyclic 2,081-edge workstream graph is a safer remediation baseline than the published 2,723-edge graph.

### English EFL

| Metric | Result |
|---|---:|
| Standards | 40 |
| Topics | 120 |
| Standard/topic verification status | `official-source-checked` |
| Normalized assessment-prompt templates | 1 |
| Item-level topic `sourceLocator` | 0 / 120 |
| Internal dependency edges touching English | 214 |
| Cross-subject English edges | 0 |

English is correctly framed as Korean EFL rather than native-speaker ELA, and the standard code inventory is supported. It remains candidate-only because the integrated layer collapses skill-specific assessment into one template, loses richer workstream evidence, has no topic-level locators, does not separately map recommended language forms, and lacks teacher-reviewed Korean classroom/culture examples.

### Social studies

| Metric | Result |
|---|---:|
| Standards | 72 |
| Topics | 216 |
| Standard verification status | 72 `needs-official-code-check` |
| Topic verification status | 216 `public-doc-derived` |
| Dataset-only / official-only codes | 45 / 22 |
| Parent semantic sample | 0 PASS / 1 PARTIAL / 19 FAIL |
| Unique assessment prompts | 216 / 216 |
| Cross-subject social edges | 0 |

The local content is deliberately Korea-first and covers local community, Korean geography/history, civics, economy, and culture. That is a design strength, not proof that the standard anchors are official. Several identical code strings have unrelated meanings:

- Dataset `kr-2022-elem-social-studies:[4사02-02]` means landforms; official `[4사02-02]` concerns old objects/documents as evidence of the past.
- Dataset `kr-2022-elem-social-studies:[4사05-01]` means classroom rules; official `[4사05-01]` concerns map types and map elements.
- Dataset `kr-2022-elem-social-studies:[6사05-01]` means constitution/basic rights; official `[6사05-01]` concerns Confucian culture's influence on Joseon life.

The social workstream must be rebuilt from official Annex 7 rather than relabeled as verified.

## Findings by Severity

### Critical

1. **Curricular identity failure:** 92 dataset codes are absent from their governing base PDFs, 62 base official codes are omitted, and current Annex 15 adds nine unrepresented `건강한 생활` standards.
2. **Semantic code collisions:** social and physical-education records reuse official-looking codes with unrelated meanings. Code-shaped identifiers are not reliable anchors.
3. **Graph contract failure:** 344 cyclic SCCs make the published dependencies unsafe as a prerequisite DAG.
4. **Publication-quality failure:** duplicated placeholder topics, unresolved Korean particles, generic prompts, and provenance-only evidence prevent teacher/learner-facing use.
5. **Rights/provenance HOLD:** KR upstream conditions and work-specific KOGL/permission evidence are absent from `PROVENANCE.md` and source metadata.

### Important

1. Six of 21 source objects violate the source schema's required fields; two stored URLs were 404 in the parent live check.
2. The custom validator never invokes JSON Schema and permits status inflation, semantic clones, reversed age ranges, unclustered topics, and per-subject placeholder collapse in isolated adversarial tests.
3. All 324 art/music/PE topics have empty verification status; the same 324 records carry English facet labels and duplicate surface content.
4. All 2,019 topic `evidence[]` arrays encode decomposition provenance rather than observable mastery evidence.
5. The graph has zero cross-subject edges. This is acceptable only if explicitly defined as a subject-isolated graph; it cannot be presented as a fully integrated elementary prerequisite graph.
6. English EFL has good orientation but only one normalized prompt template and no topic-level source locators.

### Minor / release-hygiene findings

1. `docs/kr-full-depth-integration-report.md` still reports 2,722 dependencies while current data and validators report 2,723.
2. The branch is named `kr-full-depth-v0.3`, while generated KR files report taxonomy version `kr-full-depth-v0.4`; release/version semantics are unclear.
3. Source metadata contains multiple aliases for the same inventory/list URLs and inconsistent `url` versus `sourceUrl` fields.
4. Multi-cluster membership is undocumented: 503 topics overall and 20 English topics appear in multiple clusters. This may be intentional, but consumer counting behavior needs an explicit contract.

## Independent Re-verification

### Repository and validator baseline

Commands executed:

```sh
git branch --show-current
git rev-parse HEAD
git status --short --branch
npm run validate:kr
npm run validate
```

Result: branch and commit matched the audit target; both validators passed; the only untracked repository area before this synthesis was `audits/` containing the five parent reports.

### Graph reproduction

A whole-graph Node/Tarjan pass loaded `data/kr/topics.json` and `data/kr/dependencies.json`, computed SCCs over all nodes, then repeated the pass after filtering `source !== "integration-builder"`, `basis !== "generated-within-standard-order"`, and `basis !== "generated-cluster-adjacency"`.

Reproduced results:

```json
{
  "all": {"edges":2723,"cyclicSccs":344,"cyclicTopics":832,"sizes":{"2":222,"3":121,"25":1}},
  "withoutIntegrationBuilder": {"edges":2081,"cyclicSccs":0,"cyclicTopics":0},
  "withoutWithinStandard": {"edges":2182,"cyclicSccs":1,"cyclicTopics":25},
  "withoutClusterAdjacency": {"edges":2622,"cyclicSccs":319,"cyclicTopics":759},
  "reciprocalPairs": 222,
  "crossSubjectEdges": 0,
  "missingEndpoints": 0,
  "selfEdges": 0
}
```

### Official code inventories

The disputed subject PDFs were fetched read-only from NCIC, converted with `pdftotext -layout`, and compared as sets to the corresponding `curricula[].standards[].code` values.

Exact official URLs:

- Social Annex 7: `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003800&orgType=ogi4`
- Art Annex 13: `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003555&orgType=ogi4`
- Music Annex 12: `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003561&orgType=ogi4`
- Physical Education Annex 11: `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003695&orgType=ogi4`
- Current amended Annex 15: `https://ncic.re.kr/inv/org/download.do?year=2026&seq=10004214&orgType=ogi4`

Command form executed for each base subject:

```sh
curl -fsSL --max-time 60 -A 'Mozilla/5.0' '<official PDF URL>' \
  | pdftotext -layout - - \
  | node --input-type=module -e '<extract official code set; compare with data/kr/curriculum-standards.json>'
```

The results exactly reproduced the parent report's 92 dataset-only and 62 official-only base counts. The amended Annex 15 pass reproduced 57 current integrated codes and the nine `건강한 생활` codes listed above.

### Content and source-record counts

A full-corpus Node pass over `data/kr/topics.json` reproduced:

```text
topics=2019
exact duplicate name/title/titleKorean/description groups=99, records=324
duplicate assessment prompt groups=209, records=642
unresolved-particle records=1152
English facet labels in Korean-facing names=324
source-to-topic-decomposition only=2019
missing sourceLocator=1671
official-source-checked without sourceLocator=909
English normalized prompt templates=1
social unique prompts=216
```

A source-object required-field pass against `schema/kr-curriculum-standards.schema.json:78` reproduced the six failing IDs:

```text
kr-moe-2022-33-annex5-pdf
kr-ncic-2022-elem-korean-attachment
kr-ncic-2022-notice-543
kr-ncic-2026-amendment-notice-1864
kr-ncic-domestic-inventory
kr-ncic-practical-arts-pdf-2022
```

### Semantic collision spot checks

The repository summaries for `[4사02-02]`, `[4사05-01]`, `[6사05-01]`, and `[4체03-01]` were queried directly from `data/kr/curriculum-standards.json`. The same codes were extracted with surrounding text from official Annexes 7 and 11. All four parent-reported collisions were reproduced.

### Licensing boundary

The command below returned no KR/NCIC/MOE/KOGL hits in repository provenance/license files:

```sh
rg -n -i 'Korea|Korean|NCIC|MOE|한국|교육부|공공누리|KOGL' \
  PROVENANCE.md README.md LICENSE-CONTENT package.json
```

The live NCIC policy at `https://ncic.re.kr/mbr/policy.do` says users must confirm that the individual work carries the applicable KOGL mark; the displayed Type 2 conditions require attribution and prohibit commercial use. This supports a **HOLD**, not a legal conclusion.

## Prioritized Must-Fix Remediation Plan

### P0 — Freeze unsafe release claims

1. Mark the KR artifact non-canonical and candidate-only in every consumer-facing manifest/API/documentation surface.
2. Block prerequisite-DAG consumers from loading the current 2,723-edge graph.
3. Do not describe `official-source-checked` as a release guarantee until evidence rules are machine-enforced.
4. Do not make general/commercial redistribution claims for the KR layer until the rights/provenance gate closes.

### P1 — Rebuild official curricular anchors

1. Rebuild social studies from the 49 elementary codes and meanings in official Annex 7. Do not preserve the local six-by-six scaffold merely for identifier continuity.
2. Remove standalone grade-1-2 art/music/PE subject-code families and route appropriate foundations through integrated curricula.
3. Rebuild art, music, and PE against Annexes 13, 12, and 11, including all official-only codes and correct domain meanings.
4. Reconcile amended Annex 15 and add the nine `건강한 생활` standards plus their topics, mappings, clusters, and dependencies.
5. Add direct, normalized source records and item-level locators for all governing subject PDFs.

Acceptance gate: zero unexplained dataset-only or official-only codes against pinned reviewed attachment hashes, and zero sampled code-to-meaning collisions.

### P2 — Restore a valid graph contract

1. Remove or segregate all `integration-builder` edges from the canonical prerequisite relation.
2. Re-derive within-standard direction from explicit facet semantics, never lexical topic ID order.
3. Review cluster-adjacency edges independently; cluster order is not prerequisite evidence.
4. Make the graph contract explicit: DAG prerequisite relation versus a more general typed relation graph.
5. Prefer the 2,081-edge acyclic workstream baseline over padding to 2,500.

Acceptance gate: zero cyclic SCCs and zero reciprocal prerequisite pairs, unless the relation type is explicitly non-prerequisite and excluded from DAG consumers.

### P3 — Rewrite and review learner-facing topics

1. Resolve all Korean particle placeholders and malformed forms.
2. Collapse or rewrite the 324 exact duplicate art/music/PE topics.
3. Replace English facet tokens in Korean-facing fields.
4. Give each facet a distinct teachable idea and skill-specific assessment prompt.
5. Separate provenance from observable mastery evidence; retain both in typed fields.
6. Add source locators and generation bases, especially for records labeled official.
7. Conduct subject-expert and classroom calibration after automated lint passes.

Acceptance gate: zero unresolved placeholder patterns, zero unreviewed exact semantic duplicate groups, and evidence/prompt review coverage recorded per subject.

### P4 — Close provenance and rights gaps

1. Add a Korean/NCIC/MOE section to `PROVENANCE.md`.
2. Record work-specific official title, attachment number, publisher, URL, retrieval date, bytes, SHA-256, pages, locator policy, KOGL mark/type or permission basis, attribution, and commercial-use boundary.
3. Replace or archive the two dead notice URLs with verified current equivalents.
4. Obtain a qualified rights review for source-derived summaries and intended distribution modes.

Acceptance gate: every source-derived KR record resolves to normalized source metadata and a documented redistribution basis appropriate to the intended release.

### P5 — Re-run independent release review

1. Re-run deterministic build, JSON Schema, official inventory diff, semantic samples, current-amendment check, graph gates, Korean lint, duplicate checks, URL probes, and rights review.
2. Refresh version labels, manifest/report counts, and all consumer documentation.
3. Require a new independent curriculum/content audit before changing the classification from `no-go`.

## Proposed Validator Gates

| Gate | Required behavior | Failure condition |
|---|---|---|
| JSON Schema | Validate every `data/kr/*.json` file with Draft 2020-12/Ajv or equivalent. | Any schema violation, including missing source `name`/`url`/`usage`. |
| Official source snapshot | Pin attachment URL/number, SHA-256, pages, code inventory, and retrieval date per subject. | Unexplained dataset-only/official-only code or source-hash drift. |
| Current amendment | Maintain an explicit current-source set and supersession graph. | A current official code family such as `건` cannot be represented or is omitted. |
| Verification status | Require direct governing source, locator/evidence, reviewer, date, and source hash for `official-source-checked`. | Status can be changed without qualifying evidence. |
| Code semantics | Maintain reviewed code-to-domain/summary fixtures and collision samples. | Code exists but its local domain/summary contradicts the official meaning. |
| DAG | Run Tarjan/Kosaraju over prerequisite edges and reject SCCs larger than 1. | Any cycle or reciprocal prerequisite pair. |
| Generated-edge policy | Keep generated navigation/adjacency edges in a non-prerequisite relation type. | Lexical/cluster adjacency enters the canonical prerequisite DAG without review. |
| Semantic duplicates | Report normalized duplicate name/description/prompt/evidence signatures per subject/grade/domain. | Unreviewed exact duplicate learner-facing topics or cloned facet payloads. |
| Korean surface lint | Reject unresolved particles and known malformed forms; run Korean human review. | `을/를`, `이/가`, `이(가)`, `을(를)`, `하기과`, `존중를`, `조건와`, or English facet tokens remain in Korean-facing fields. |
| Evidence semantics | Validate typed provenance separately from observable learner evidence. | All facets reuse decomposition provenance as their only evidence. |
| Assessment distinctness | Enforce skill/facet-specific prompt signatures and review coverage. | A subject such as English collapses all topics to one normalized template. |
| Mapping completeness | Require every topic to have an approved standard mapping and allowed cluster membership count. | Unmapped/unclustered topic or undocumented multiple membership. |
| Grade progression | Enforce age range ordering and reviewed cross-band direction. | `ageRangeStart > ageRangeEnd` or later-grade prerequisite reversal. |
| Cross-subject policy | Declare zero-edge isolation or a reviewed bridge allowlist/minimum. | Graph behavior contradicts the declared integration contract. |
| Source reachability | Probe HTTP(S), verify local paths, and preserve archived equivalents. | Dead source without an archived/current replacement. |
| Documentation/version sync | Compare manifests, reports, branch/release labels, and generated versions. | Count/version drift such as 2,722 versus 2,723 or v0.3 versus v0.4. |

Global count minima must not substitute for any quality gate. In particular, `MIN_DEPENDENCIES=2500` should be removed or made subordinate to DAG and semantic-review requirements.

## Final Release Decision

**NO-GO for canonical or public/general release.**

The current KR corpus may be retained only as a clearly labeled internal candidate and remediation source. The next defensible release decision requires official-anchor reconstruction, current-amendment coverage, an acyclic reviewed prerequisite graph, natural and distinct learner-facing content, machine-enforced evidence/status rules, and a documented Korean provenance/rights basis.

