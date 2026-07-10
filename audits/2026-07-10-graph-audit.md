# KR prerequisite graph semantic and DAG audit

Date: 2026-07-10  
Repo: `/Volumes/data/Dev/os-taxonomy`  
Branch observed: `kr-full-depth-v0.3` tracking `origin/kr-full-depth-v0.3`  
KR data version observed: `kr-full-depth-v0.4` in `data/kr/topics.json`, `data/kr/dependencies.json`, `data/kr/curriculum-standards.json`, and `data/kr/clusters.json`  
Audited data: `data/kr/topics.json`, `data/kr/dependencies.json`, `data/kr/curriculum-standards.json`, `data/kr/clusters.json`, `data/kr/manifest.json`

## Verdict

**No ship for canonical prerequisite-graph use.**

The KR files pass the repository validators, and the graph has no missing endpoints, self edges, duplicate directed pairs, direct age reversals, or direct grade-band reversals. That is a structural integrity pass, not a curricular graph-quality pass.

The current `data/kr/dependencies.json` is **not a DAG**. Tarjan SCC analysis found **344 cyclic SCCs covering 832 of 2,019 topics**. Removing the deterministic `integration-builder` edges leaves **2,081 workstream edges and zero cycles**; adding the builder edges raises the graph to **2,723 edges** and introduces all observed cycles. Because the published count exceeds the 2,500-edge target only through these generated edges, the current 2,500+ edge count should be treated as target-satisfying scaffolding, not reviewed prerequisite progression.

## Commands run

```sh
git status --short --branch
npm run validate:kr
npm run validate
node --input-type=module  # custom whole-graph audit: counts, Tarjan SCCs, weak components, reciprocal pairs, age/grade checks, source/reason distributions
nl -ba scripts/build-kr-full-depth.mjs | sed -n '58,96p'
nl -ba scripts/build-kr-full-depth.mjs | sed -n '294,376p'
```

Validator results:

```text
✓ KR full-depth data valid - 11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters. Checksums OK.
✓ valid — 1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.
```

## Data integrity counts

| Check | Result |
| --- | ---: |
| `topics.topicCount` / actual topics | 2,019 / 2,019 |
| `dependencies.edgeCount` / actual dependencies | 2,723 / 2,723 |
| `curriculum-standards.standardCount` / actual standards | 641 / 641 |
| `clusters.clusterCount` / actual clusters | 155 / 155 |
| Missing dependency endpoints | 0 |
| Self dependencies | 0 |
| Duplicate directed dependency pairs | 0 |
| Direct later-grade prerequisites | 0 |
| Direct later-age prerequisites | 0 |

Subject node counts:

| Subject | Topics |
| --- | ---: |
| 수학 | 363 |
| 국어 | 348 |
| 과학 | 306 |
| 사회 | 216 |
| 통합교과 | 144 |
| 도덕 | 120 |
| 영어 | 120 |
| 미술 | 108 |
| 음악 | 108 |
| 체육 | 108 |
| 실과(기술·가정)/정보 | 78 |

## DAG result

Dependency orientation is repository-defined as `topicId` depends on `prerequisiteId`.

Tarjan SCC results over all 2,019 topics and 2,723 directed edges:

| SCC metric | Count |
| --- | ---: |
| Total SCCs | 1,531 |
| Cyclic SCCs | 344 |
| Topics inside cyclic SCCs | 832 |
| Cyclic SCC size distribution | 222 size-2, 121 size-3, 1 size-25 |

Cyclic topics by subject:

| Subject | Cyclic topics |
| --- | ---: |
| 수학 | 363 |
| 과학 | 204 |
| 사회 | 144 |
| 도덕 | 96 |
| 영어 | 25 |

Variant check:

| Edge set | Edges | Cyclic SCCs | Cyclic topics |
| --- | ---: | ---: | ---: |
| All edges | 2,723 | 344 | 832 |
| Workstream-only / no `integration-builder` | 2,081 | 0 | 0 |
| Without `generated-within-standard-order` | 2,182 | 1 | 25 |
| Without `generated-cluster-adjacency` | 2,622 | 319 | 759 |

This localizes the DAG breakage to generated builder edges. `scripts/build-kr-full-depth.mjs:83-96` sorts topics by code then topic id, and `scripts/build-kr-full-depth.mjs:330-341` adds hard `generated-within-standard-order` edges in that sorted order. `scripts/build-kr-full-depth.mjs:345-355` adds soft cluster-adjacency edges. `scripts/build-kr-full-depth.mjs:359-374` contains additional dependency padding logic that adds cluster-span edges until `MIN_DEPENDENCIES` is met, though the current output reaches 2,723 without span edges.

### Representative cycle: math 3-cycle

All 363 math topics are cyclic. Example SCC size 3:

| Edge | Source / basis | Reason |
| --- | --- | --- |
| `kr.mt.math.number-operations.g1-2.s2-01-01.concept -> kr.mt.math.number-operations.g1-2.s2-01-01.application` | `integration-builder` / `generated-within-standard-order` | `[2수01-01] 성취기준 안에서 앞선 세부 주제의 개념·표현 경험이 다음 세부 주제 수행을 지지한다.` |
| `kr.mt.math.number-operations.g1-2.s2-01-01.application -> kr.mt.math.number-operations.g1-2.s2-01-01.representation` | `workstream:math.json` / `within-standard decomposition order` | `[2수01-01] '네 자리 이하의 수': 적용·설명 과제 전에 표현과 연결 활동이 필요하다.` |
| `kr.mt.math.number-operations.g1-2.s2-01-01.representation -> kr.mt.math.number-operations.g1-2.s2-01-01.concept` | `workstream:math.json` / `within-standard decomposition order` | `[2수01-01] '네 자리 이하의 수': 표현 활동 전에 핵심 개념 확인이 필요하다.` |

The workstream chain is semantically plausible: concept -> representation -> application, expressed in dependency orientation as application depends on representation, representation depends on concept. The generated edge makes concept depend on application. That reverses the intended decomposition and closes the cycle.

### Representative cycle: social reciprocal pair

Example direct 2-cycle:

| Edge | Source / basis | Reason |
| --- | --- | --- |
| `kr.mt.social.local-geography.3-4.01.inquiry -> kr.mt.social.local-geography.3-4.01.source` | `workstream:social.json` / `requires-source-analysis-before-inquiry` | `Inquiry and participation tasks should be evidence-based rather than opinion-only.` |
| `kr.mt.social.local-geography.3-4.01.source -> kr.mt.social.local-geography.3-4.01.inquiry` | `integration-builder` / `generated-within-standard-order` | `[4사01-01] 성취기준 안에서 앞선 세부 주제의 개념·표현 경험이 다음 세부 주제 수행을 지지한다.` |

The workstream edge says inquiry depends on source analysis. The generated edge says source analysis depends on inquiry. These cannot both be prerequisite facts.

Direct reciprocal dependency pairs: **222**.

| Subject | Reciprocal pairs |
| --- | ---: |
| 과학 | 102 |
| 사회 | 72 |
| 도덕 | 48 |

### Representative cycle: English size-25 SCC

There is one English SCC with 25 topics, all in grade band 5-6. The SCC spans expression and understanding topics. The cycle includes workstream sequence edges plus two generated cluster-adjacency bridges:

| Edge | Source / basis | Notes |
| --- | --- | --- |
| `kr.mt.english-efl.5-6.expression.6영02-01.02.리듬-있는-짧은-발표 -> kr.mt.english-efl.5-6.understanding.6영01-10.01.문화-비교-표현-이해` | `integration-builder` / `generated-cluster-adjacency` | Closes back into the listening/understanding chain. |
| `kr.mt.english-efl.5-6.understanding.6영01-08.03.매체-선택-이유-말하기 -> kr.mt.english-efl.5-6.expression.6영02-07.02.들은-내용-답하기` | `integration-builder` / `generated-cluster-adjacency` | Bridges understanding/expression in a way that helps form the SCC. |
| Workstream sequence edges such as `...6영02-01.03.억양으로-의도-표현 -> ...6영02-01.02.리듬-있는-짧은-발표` | `workstream:english-efl.json` / `workstream-authored` | Locally plausible, but not safe once cluster adjacency is overlaid. |

## Components, roots, and leaves

Weak components ignore edge direction.

| Metric | Count |
| --- | ---: |
| Weak components | 61 |
| Isolated nodes | 0 |
| Roots, defined as topics with no prerequisites | 64 |
| Leaves, defined as topics that unlock no dependent topics | 49 |

Largest weak components:

| Rank | Size | Edges | Dominant subject/domain |
| ---: | ---: | ---: | --- |
| 1 | 363 | 489 | 수학, all domains |
| 2 | 288 | 300 | 국어 except separate 문학 component |
| 3 | 216 | 364 | 사회, all six social domains |
| 4 | 144 | 173 | 통합교과, 바른/슬기로운/즐거운 생활 |
| 5 | 120 | 214 | 영어 |
| 6 | 78 | 79 | 실과(기술·가정)/정보 |
| 7 | 60 | 60 | 국어/문학 |

Root counts by subject: 과학 18, 체육 15, 미술 9, 음악 9, 국어 4, 실과(기술·가정)/정보 4, 사회 3, 영어 1, 통합교과 1. Math has no roots because every math topic is inside a cycle. Leaves by subject: 체육 15, 미술 9, 음악 9, 국어 6, 도덕 4, 실과(기술·가정)/정보 4, 영어 1, 통합교과 1.

## Subject and domain isolation

| Check | Result |
| --- | ---: |
| Cross-subject dependency edges | 0 |
| Same-subject cross-domain edges | 67 |

Subject isolation is internally consistent, but it also means the KR graph is not an integrated cross-subject prerequisite graph. There are no math-to-science, language-to-social, or data-to-science bridges even where such prerequisites might be educationally plausible.

Same-subject cross-domain edges are concentrated in places where cross-domain flow may be intentional:

| Domain pair | Edges |
| --- | ---: |
| 통합교과: 슬기로운 생활 -> 바른 생활 | 16 |
| 통합교과: 즐거운 생활 -> 슬기로운 생활 | 16 |
| 국어: 매체 -> 쓰기 | 3 |
| 수학: 도형과 측정 -> 변화와 관계 | 3 |
| 수학: 변화와 관계 -> 수와 연산 | 3 |
| 수학: 자료와 가능성 -> 도형과 측정 | 3 |

Example plausible integrated edge:

`kr.mt.integrated.joyful-life.who.2jeul0101.01 -> kr.mt.integrated.wise-life.who.2seul0101.03`, source `workstream:integrated.json`, reason: `우리는 누구로 살아갈까 통합 흐름에서 슬기로운 생활 탐구 결과가 즐거운 생활 놀이·표현으로 확장된다.`

## Hard vs soft and source distribution

| Strength | Edges |
| --- | ---: |
| hard | 1,320 |
| soft | 1,403 |

Edges by source:

| Source | Edges |
| --- | ---: |
| `integration-builder` | 642 |
| `workstream:korean.json` | 360 |
| `workstream:math.json` | 359 |
| `workstream:arts-pe.json` | 291 |
| `workstream:science.json` | 289 |
| `workstream:social.json` | 220 |
| `workstream:integrated.json` | 173 |
| `workstream:moral.json` | 164 |
| `workstream:english-efl.json` | 146 |
| `workstream:practical-arts.json` | 79 |

Key basis counts:

| Basis | Edges |
| --- | ---: |
| `workstream-authored` | 1,049 |
| `generated-within-standard-order` | 541 |
| `within-standard decomposition order` | 494 |
| `official-code sequence within grade-band/domain` | 109 |
| `generated-cluster-adjacency` | 101 |

The 642 `integration-builder` edges consist of 541 hard generated-within-standard edges and 101 soft generated-cluster-adjacency edges. Of these, 379 lie inside cyclic SCCs. All cycles disappear when all `integration-builder` edges are removed.

## Reason quality

Every dependency has a non-empty `reason`, but many reasons are templated rather than edge-specific.

| Reason metric | Count |
| --- | ---: |
| Unique exact reason strings | 1,507 |
| Reasons used only once | 1,171 |
| Edges sharing a repeated exact reason | 1,552 |

Top repeated reasons:

| Reason | Edges |
| --- | ---: |
| `Learners need the domain concept before interpreting maps, timelines, statistics, or civic source material.` | 72 |
| `Inquiry and participation tasks should be evidence-based rather than opinion-only.` | 72 |
| `The next domain focus builds on the previous focus in the same grade-band sequence.` | 60 |
| `같은 성취기준 안에서 인식 주제가 절차 연습보다 먼저 필요합니다.` | 40 |
| `평가·전이 주제는 절차 연습 뒤에 배치하는 것이 자연스럽습니다.` | 40 |
| `생활 적용 활동은 해당 성취기준의 핵심 개념 탐색 이후 수행되어야 한다.` | 39 |
| `미술 체험 영역 내 이전 활동 이해가 후속 표현·감상에 도움을 줍니다.` | 33 |
| `음악 표현 영역 내 이전 활동 이해가 후속 표현·감상에 도움을 줍니다.` | 33 |
| `체육 건강 영역 내 이전 활동 이해가 후속 표현·감상에 도움을 줍니다.` | 21 |

The social-studies reasons are pedagogically reasonable but generic and repeated. The arts/PE reasons are weaker; for example, `체육 건강 영역 내 이전 활동 이해가 후속 표현·감상에 도움을 줍니다.` uses expression/appreciation language for physical education health.

## Semantic sampling

Sampled edges show a split between locally sensible workstream edges and unsafe generated overlays.

| Subject | Sample | Assessment |
| --- | --- | --- |
| 국어 | `kr.mt.korean.listening-speaking.1-2.2guk0101.02 -> ...2guk0101.01`, reason `[2국01-01] 2번째 세부 주제는 앞선 1번째 세부 주제의 이해와 수행 경험을 바탕으로 한다.` | Plausible local sequence. |
| 수학 | `kr.mt.math.number-operations.g1-2.s2-01-01.representation -> ...concept`, reason says representation needs concept. | Plausible workstream edge. |
| 수학 | `kr.mt.math.number-operations.g1-2.s2-01-01.concept -> ...application`, generated by `integration-builder`. | Not plausible as prerequisite; it makes concept depend on application and closes a cycle. |
| 과학 | `kr.mt.science.motion-energy.force-life.g4-01-01.representation -> ...concept`, reason says observations/data representation need core concept. | Plausible local sequence. |
| 사회 | `kr.mt.social.local-geography.3-4.01.source -> ...concept`, reason says domain concept before maps/timelines/statistics/civic source material. | Plausible but generic. |
| 사회 | `kr.mt.social.local-geography.3-4.01.source -> ...inquiry`, generated by `integration-builder`. | Conflicts with the workstream edge that inquiry depends on source analysis. |
| 영어 | `kr.mt.english-efl.5-6.expression.6영02-01.02.리듬-있는-짧은-발표 -> ...6영01-02.02.문장-리듬-살려-읽기` | Plausible EFL understanding-to-expression support. |
| 영어 | `...리듬-있는-짧은-발표 -> ...문화-비교-표현-이해`, generated cluster adjacency. | Not obviously a prerequisite and participates in the size-25 SCC. |
| 통합교과 | joyful-life topic depending on wise-life inquiry result | Plausible integrated-subject flow. |
| 실과(기술·가정)/정보 | `...0101.practice -> ...0101.concept`, reason says 생활 적용 follows 핵심 개념 탐색. | Plausible. |
| 미술/음악/체육 | Names such as `미술 체험 1-2 concept`, `체육 건강 1-2 practice`; repeated reasons. | Graph structure exists, but topic text and reasons are too generic for canonical release. |

## Verification and source posture

Top-level `data/kr/curriculum-standards.json` has `verificationStatus: "needs-official-code-check"` and `status: "integrated-workstream-candidate"`.

Standards by verification status:

| Verification status | Standards |
| --- | ---: |
| `official-source-checked` | 461 |
| `needs-official-code-check` | 180 |

Standards needing official code check: 사회 72, 미술 36, 음악 36, 체육 36.

Topics by verification status:

| Verification status | Topics |
| --- | ---: |
| `official-source-checked` | 1,257 |
| `public-doc-derived` | 438 |
| missing | 324 |

The 324 missing topic verification statuses are all arts/PE topics: 미술 108, 음악 108, 체육 108.

The source table includes 21 source records. Important stored URLs include:

| Source id | URL |
| --- | --- |
| `kr-moe` | `https://www.moe.go.kr/` |
| `kr-ncic` | `https://ncic.re.kr/` |
| `kr-ncic-2022-notice-543` | `https://ncic.re.kr/bbs/eduNotice2022/view/543.do?searchword=&searchkey=&page=1` |
| `kr-ncic-math-pdf-2022` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003559&orgType=ogi4` |
| `kr-ncic-science-pdf-2022` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003551&orgType=ogi4` |
| `kr-ncic-2022-english-pdf` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003794&orgType=ogi4` |
| `kr-ncic-moral-pdf-2022` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003738&orgType=ogi4` |
| `kr-ncic-practical-arts-pdf-2022` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003781&orgType=ogi4` |
| `kr-moe-2022-33-annex15-pdf` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003571&orgType=ogi4` |

Two source objects do not have a `url` property even though `schema/kr-curriculum-standards.schema.json` requires source `url`. They instead use `sourceUrl`, so helper code that reads `source.url` will omit them:

| Source id | Stored `sourceUrl` |
| --- | --- |
| `kr-moe-2022-33-annex5-pdf` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003553&orgType=ogi4` |
| `kr-ncic-2022-elem-korean-attachment` | `https://ncic.re.kr/inv/org/list.do` |

This was not caught by `npm run validate:kr`, because `scripts/validate-kr.mjs` performs custom checks and does not enforce the JSON Schema source `required` list.

## Target-padding assessment

The edge target is at least 2,500 dependencies. Current count is 2,723. However:

- Workstream-authored edge set: 2,081 edges, 0 cycles.
- Deterministic builder additions: 642 edges.
- Published graph after additions: 2,723 edges, 344 cyclic SCCs.
- Removing all `integration-builder` edges restores the DAG property but drops below the 2,500 target.

Therefore the 2,500+ count is not reliable evidence of meaningful progression. The count is materially dependent on deterministic within-standard and cluster-adjacency artifacts, and those artifacts are the source of the DAG violation.

## Required fixes before ship

1. Add an explicit DAG check to `scripts/validate-kr.mjs`; fail validation on any SCC larger than 1 or any reciprocal pair.
2. Remove, reverse, or semantically rederive `generated-within-standard-order` edges. Topic id lexical order is not a valid prerequisite order.
3. Rebuild cluster-adjacency edges only after checking direction against dependency semantics; do not let cluster ordering create cross-domain or cross-mode cycles.
4. Treat the 2,500 dependency target as secondary to graph correctness. A 2,081-edge acyclic graph is preferable to a 2,723-edge cyclic graph.
5. Add reviewer-owned edge provenance for generated edges, or mark them as non-canonical candidates excluded from DAG consumers.
6. Normalize source records to use `url` consistently, or update schema and validators to accept `sourceUrl`.
7. Fill missing topic verification statuses for 미술, 음악, 체육 and reconcile the 180 standards marked `needs-official-code-check`.
8. Replace generic arts/PE topic names and reasons with discipline-specific topics and rationales before canonical release.

## Final ship decision

Ship as a **candidate dataset only** if clearly labeled non-canonical and not consumed as a prerequisite DAG.

Do **not** ship as a canonical KR prerequisite graph until the graph is acyclic and generated edges are either reviewed, removed, or segregated from canonical dependencies.
