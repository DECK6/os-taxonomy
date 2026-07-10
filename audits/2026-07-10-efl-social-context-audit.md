# KR EFL and Social Context Audit

Date: 2026-07-10
Repo: `/Volumes/data/Dev/os-taxonomy`
Branch: `kr-full-depth-v0.3`
Audit target: current integrated KR taxonomy files under `data/kr/`, with English EFL and social studies traced back to their workstream artifacts.

## Verdict

**Do not ship the current KR taxonomy as canonical for social studies.** The JSON graph is structurally valid, Korea-centered, and internally consistent, but all 72 social-studies standards are still `needs-official-code-check` and explicitly depend on `kr-project-v03-social-seed` as a candidate scaffold. The artifact itself documents high-severity gaps for exact social-studies code/text extraction and domain-shape confirmation.

**English EFL is shippable only as an official-code-checked staged candidate, not as a classroom-ready final layer.** The 40 English standards are `official-source-checked`, use NCIC attachment metadata for `[별책14] 영어과 교육과정.pdf`, and avoid native-speaker ELA framing. However, integrated topic evidence is generic after the build step, all 120 English assessment prompts share one template, and the artifact itself records unresolved follow-up for language forms, teacher calibration, media examples, and local culture examples.

## Files Reviewed

- `data/kr/curriculum-standards.json`
- `data/kr/topics.json`
- `data/kr/dependencies.json`
- `data/kr/clusters.json`
- `data/kr/workstreams/english-efl.json`
- `data/kr/workstreams/social.json`
- `data/kr/manifest.json`
- `schema/kr-curriculum-standards.schema.json`
- `schema/kr-topics.schema.json`
- `schema/kr-dependencies.schema.json`
- `schema/kr-clusters.schema.json`
- `scripts/validate-kr.mjs`
- `scripts/build-kr-full-depth.mjs`
- `scripts/build-english-efl-workstream.mjs`
- `docs/kr-curriculum-mapping-method.md`
- `docs/kr-full-depth-integration-report.md`
- `docs/kr-subject-redesign-notes.md`

## Commands Run

```sh
git -C /Volumes/data/Dev/os-taxonomy branch --show-current
npm run validate:kr
npm run validate
node -e "<JSON corpus audit queries over data/kr/*.json>"
```

Validation results:

```text
kr-full-depth-v0.3
✓ KR full-depth data valid - 11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters. Checksums OK.
✓ valid — 1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.
```

Documentation drift: `docs/kr-full-depth-integration-report.md` states `2722` KR dependencies, but the current validator and `data/kr/dependencies.json` report `2723`.

## Source URLs and Provenance

English EFL source refs in `data/kr/curriculum-standards.json` and `data/kr/workstreams/english-efl.json`:

- `kr-ncic-2022-english-pdf`: `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003794&orgType=ogi4`
- `kr-ncic-inventory-api`: `https://ncic.re.kr/inv/org/list.do`
- Workstream evidence records `subjectCode: 3360`, `pdfAttachmentNo: 10003794`, `hwpAttachmentNo: 10003795`, PDF file name `[별책14] 영어과 교육과정.pdf`, `pages: 306`, `pdfCreationDate: 2022-12-19`, `ncicUploadDate: 2023-10-12 13:54:25`.

Social-studies source refs:

- `kr-ncic-2022-notice-list`: `https://ncic.re.kr/bbs/eduNotice2022/list.do`
- `kr-ncic-inventory`: `https://ncic.re.kr/inv/org/list.do`
- `kr-project-v03-social-seed`: `file:data/kr/curriculum-standards.seed.json`

External official-source verification blocker: this audit did not extract the official social-studies PDF/HWP achievement-standard lines. The current repo artifact also states that exact social-studies achievement-standard codes and wording were not fully extracted. Therefore, social curricular correctness cannot be certified beyond Korea-centered candidate design.

## Whole-Corpus Counts

| Area | Standards | Topics | Mappings | Clusters | Dependency edges touching subject | Verification posture |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| English EFL | 40 | 120 | 120 | 12 | 214 | `official-source-checked` standards and topics |
| Social Studies | 72 | 216 | 216 | 12 | 364 | standards `needs-official-code-check`; topics `public-doc-derived` |

All audited standards have exactly three integrated micro-topics. All audited topics have exactly one standard reference and a resolving standard mapping. No audited topics are unclustered. No dependency endpoints or cluster topic references are dangling.

Important graph limitation: English EFL and social studies have **zero cross-subject dependency edges** in the integrated graph. All 214 English edges and all 364 social-studies edges are internal to their subject. This is structurally valid, but weak for a full elementary learning graph.

## Critical Findings

### 1. Social studies is Korea-centered but not official-code-certified

Evidence:

- `data/kr/curriculum-standards.json` curriculum `kr-2022-elem-social-studies` has `verificationStatus: "needs-official-code-check"`.
- All 72 social standards have `verificationStatus: "needs-official-code-check"`.
- All 72 social standards cite `kr-project-v03-social-seed` in addition to NCIC route refs.
- `data/kr/workstreams/social.json` source basis says the workstream preserves local v0.3 candidate identifiers while exact code/text verification remains open.
- Coverage gaps include `social-gap-official-code-text` and `social-gap-domain-shape`, both severity `high`.

Representative record IDs:

- `kr-2022-elem-social-studies:[4사01-01]` - local geography, "우리 동네 장소와 생활권".
- `kr-2022-elem-social-studies:[4사02-01]` - Korean geography, "대한민국의 위치와 영역".
- `kr-2022-elem-social-studies:[4사04-02]` - Korean history, "선사와 고조선의 생활 모습".
- `kr-2022-elem-social-studies:[6사05-01]` - civics, "헌법과 기본권의 생활 의미".
- `kr-2022-elem-social-studies:[6사06-05]` - economy/culture, "문화유산, 대중문화, 한류".

Assessment: the content direction is appropriate for Korea-first social studies, but the current standard IDs and summaries must remain candidate records until reconciled with official 2022 social-studies achievement-standard files.

### 2. English EFL avoids native ELA framing, but integrated evidence is too thin

Evidence:

- `kr-2022-elem-english-efl` has `subject: "English as a Foreign Language"` and `subjectKorean: "영어"`.
- All 40 English standards and 120 English topics are `official-source-checked`.
- `scripts/validate-kr.mjs` only checks that English topics use subject `English as a Foreign Language`; it does not validate listening/speaking load, Korean learner scaffolding, or grade-level EFL appropriateness.
- `data/kr/workstreams/english-efl.json` contains richer evidence strings such as "Mapped to verified official achievement standard..." and "this is EFL decomposition, not native ELA import."
- `data/kr/topics.json` integrated evidence for all 120 English topics is normalized to one generic object form: `evidenceType: "source-to-topic-decomposition"` and a basis saying the topic was decomposed from the standard without reproducing official text.

Representative record IDs:

- `kr-2022-elem-english-efl:[4영01-01]`
- `kr-2022-elem-english-efl:[4영02-10]`
- `kr-2022-elem-english-efl:[6영01-08]`
- `kr-2022-elem-english-efl:[6영02-10]`
- `kr.mt.english-efl.3-4.understanding.4영01-01.02.한국어-음운-전이를-고려한-기초-단어-소리-구별`
- `kr.mt.english-efl.5-6.expression.6영02-10.02.온라인-오프라인-협력-과업`

Assessment: English EFL source posture is strong at the standard level, but the integrated topic file does not preserve enough item-level evidence to support review without reopening the workstream or official document.

### 3. English assessment prompts are template-identical across all 120 topics

Corpus check:

- English topics: 120.
- Unique assessment templates after replacing only the topic name: 1.

Template:

```text
{name}을/를 확인할 수 있는 짧은 듣기·말하기·읽기·쓰기 과업을 제시하고, 학생이 한국어 도움 없이 의미를 이해하거나 표현했는지 관찰 기록으로 판정한다.
```

This is acceptable as a draft scaffold, but it is not enough for a full EFL audit. Listening topics, phonics topics, writing topics, interaction topics, culture topics, and media topics need distinct performance evidence. For example, `kr.mt.english-efl.3-4.understanding.4영01-01.01.알파벳-소리와-글자-이름-듣기-식별` and `kr.mt.english-efl.5-6.expression.6영02-08.03.경험-글-초안과-수정` currently share the same prompt structure despite assessing very different skills.

### 4. Social assessment prompts are more varied, but official and regional calibration remains open

Corpus check:

- Social topics: 216.
- Unique assessment prompts: 216.

The social prompts are well aligned to inquiry, source reading, and civic explanation. Examples:

- `kr.mt.social.local-geography.3-4.01.source` asks learners to compare two sources about local community places.
- `kr.mt.social.korean-geography.3-4.01.concept` asks learners to explain Korea's territory and location through regional/civic-life examples.
- `kr.mt.social.civics.5-6.01.concept` connects constitutional and basic-rights language to school and local-life cases.

However, official and classroom calibration remains unresolved because the whole social corpus is candidate-status. The artifact itself records `social-gap-civic-legal-precision`, `social-gap-assessment-calibration`, and `social-gap-regional-examples`.

### 5. Social content avoids foreign-default framing, but the validator only catches obvious terms

`scripts/validate-kr.mjs` checks social topic text against this regex:

```js
/\b(Common Core|US state|United States|UK national)\b/i
```

This is useful but shallow. It would catch explicit US/UK labels, not subtle foreign-default framing such as imported civic institutions, non-Korean local-government assumptions, non-Korean historical sequence, or generic "world history" drift. Manual review found the current social records are Korea-centered in their summaries and topic titles, but the automated guard does not prove that.

Positive Korea-centered evidence:

- Local community: `kr-2022-elem-social-studies:[4사01-01]`, `kr.mt.social.local-geography.3-4.01.concept`.
- Korean geography: `kr-2022-elem-social-studies:[4사02-01]`, `kr-2022-elem-social-studies:[6사02-05]`.
- Korean history chronology: `kr-2022-elem-social-studies:[4사04-02]`, `[4사04-03]`, `[4사04-04]`, `[4사04-05]`, `[6사04-03]`, `[6사04-04]`, `[6사04-05]`.
- Civics/constitution/local community: `kr-2022-elem-social-studies:[4사05-01]`, `[4사05-02]`, `[6사05-01]`, `[6사05-03]`, `[6사05-06]`.
- Culture/economy: `kr-2022-elem-social-studies:[4사06-05]`, `[6사06-04]`, `[6사06-05]`, `[6사06-06]`.

### 6. Clusters are structurally valid but serve different quality levels by subject

English clusters are pedagogical strand views over official `이해/표현` standards. Their 12 cluster IDs are valid and have no dangling topic references, but 20 English topics appear in more than one cluster because phonics/pronunciation/interaction aliases are included in broader listening, speaking, reading, or writing clusters. This is defensible as pedagogical tagging, but should be documented in product behavior to avoid double counting.

Social clusters are cleaner as one cluster per domain and grade band. All 12 social clusters contain exactly 18 topics, with no duplicate cluster membership.

## English EFL Coverage Review

### Standard Coverage

| Grade band | Codes | Count | Notes |
| --- | --- | ---: | --- |
| 3-4 understanding | `[4영01-01]` to `[4영01-10]` | 10 | listening, alphabet/phonics, meaning, strategy, media, culture |
| 3-4 expression | `[4영02-01]` to `[4영02-10]` | 10 | speaking, early writing, interaction, media, participation |
| 5-6 understanding | `[6영01-01]` to `[6영01-10]` | 10 | deeper listening/reading, sequence, strategy, media, culture |
| 5-6 expression | `[6영02-01]` to `[6영02-10]` | 10 | speaking/writing, punctuation, information exchange, short writing, cooperation |

Topic distribution:

| Domain tag | Topics |
| --- | ---: |
| Writing | 23 |
| Reading | 20 |
| Listening | 17 |
| Speaking | 16 |
| Alphabet & Phonics | 10 |
| Pronunciation | 10 |
| Culture & Intercultural | 7 |
| Vocabulary & Expressions | 6 |
| Interaction | 5 |
| Media | 4 |
| Strategies | 2 |

Type distribution: 40 `LANGUAGE`, 40 `PROCEDURAL`, 40 `META`.

### EFL Fit

Strengths:

- The subject label is explicitly EFL, not ELA.
- The grade 3-4 corpus begins with alphabet sound/name recognition, Korean phonological transfer, picture cues, classroom materials, teacher modeling, chants, and short classroom interactions.
- The grade 5-6 corpus expands toward information exchange, simple sentence production, short writing, media use, and cooperation rather than native-speaker literary analysis.
- Record IDs and names are Korean classroom oriented, for example `한국어-음운-전이를-고려한-기초-단어-소리-구별`, `교사-모델-따라-말하기`, `짝-대화에서-핵심-답하기`, and `상호-피드백으로-다시-표현`.

Gaps:

- Recommended language forms from `[별표 4]` are not separately mapped.
- Culture topics intentionally avoid US/UK defaults, but lack a reviewed Korean classroom example bank.
- Assessment prompts need skill-specific task formats and teacher review.
- Integrated topic evidence should preserve workstream evidence or include official PDF locators.

### English Clusters

| Cluster ID | Grade | Strand | Topic count |
| --- | --- | --- | ---: |
| `kr.cluster.english-efl.3-4.culture-intercultural` | 3-4 | 문화·상호문화 | 4 |
| `kr.cluster.english-efl.3-4.listening` | 3-4 | 듣기 | 12 |
| `kr.cluster.english-efl.3-4.reading` | 3-4 | 읽기 | 18 |
| `kr.cluster.english-efl.3-4.speaking` | 3-4 | 말하기 | 16 |
| `kr.cluster.english-efl.3-4.vocabulary-expressions` | 3-4 | 어휘·표현 | 4 |
| `kr.cluster.english-efl.3-4.writing` | 3-4 | 쓰기 | 18 |
| `kr.cluster.english-efl.5-6.culture-intercultural` | 5-6 | 문화·상호문화 | 3 |
| `kr.cluster.english-efl.5-6.listening` | 5-6 | 듣기 | 15 |
| `kr.cluster.english-efl.5-6.reading` | 5-6 | 읽기 | 15 |
| `kr.cluster.english-efl.5-6.speaking` | 5-6 | 말하기 | 18 |
| `kr.cluster.english-efl.5-6.vocabulary-expressions` | 5-6 | 어휘·표현 | 2 |
| `kr.cluster.english-efl.5-6.writing` | 5-6 | 쓰기 | 15 |

Cluster membership total is 140, but unique English topics are 120 because 20 topics have multiple pedagogical-strand memberships.

## Social Studies Coverage Review

### Standard Coverage

| Domain | Grade 3-4 standards | Grade 5-6 standards | Topics | Status |
| --- | ---: | ---: | ---: | --- |
| 지역 지리 | 6 | 6 | 36 | candidate |
| 한국 지리 | 6 | 6 | 36 | candidate |
| 지역사 | 6 | 6 | 36 | candidate |
| 한국사 | 6 | 6 | 36 | candidate |
| 민주시민 | 6 | 6 | 36 | candidate |
| 경제·문화 | 6 | 6 | 36 | candidate |

Type distribution: 72 `CONCEPTUAL`, 72 `PROCEDURAL`, 72 `REPRESENTATIONAL`.

### Korea-First Fit

Strengths:

- Local community starts from school, home, public facilities, markets, parks, local problems, community services, and regional comparison.
- Korean geography includes the Korean peninsula, surrounding seas, islands, climate, regional industries, transport, environmental issues, metropolitan concentration, population change, DMZ/contact zones, and East Asian connectivity.
- History coverage is explicitly Korean: prehistoric/Gojoseon, Three Kingdoms/Gaya, Goryeo, Joseon, modern transition, colonial period, liberation, division, Korean War, industrialization, democratization, and memory/representation.
- Civics includes classroom rules, public institutions, rights/responsibilities, democratic decision-making, constitution/basic rights, elections, separation of powers, human rights, media citizenship, and civic proposals.
- Economy/culture connects scarcity, local production/consumption, markets, household budgeting, Korean culture, cultural diversity, public goods, Korean economy in world trade, cultural heritage, popular culture, Hallyu, sustainable consumption, and labor rights.

Blockers:

- The current domain scheme is a local design, not confirmed as the official elementary social-studies structure.
- Exact achievement-standard wording and code lines are not included or verified.
- Named regional examples are broad categories rather than balanced coverage across Korean regions.
- The 1-2 grade social-life bridge is mostly outside this social workstream and has no explicit dependency edges into grade 3-4 social topics.

### Social Clusters

| Cluster ID | Grade | Domain | Topic count |
| --- | --- | --- | ---: |
| `kr.cluster.social.civics.3-4` | 3-4 | 민주시민 | 18 |
| `kr.cluster.social.civics.5-6` | 5-6 | 민주시민 | 18 |
| `kr.cluster.social.economy-culture.3-4` | 3-4 | 경제·문화 | 18 |
| `kr.cluster.social.economy-culture.5-6` | 5-6 | 경제·문화 | 18 |
| `kr.cluster.social.korean-geography.3-4` | 3-4 | 한국 지리 | 18 |
| `kr.cluster.social.korean-geography.5-6` | 5-6 | 한국 지리 | 18 |
| `kr.cluster.social.korean-history.3-4` | 3-4 | 한국사 | 18 |
| `kr.cluster.social.korean-history.5-6` | 5-6 | 한국사 | 18 |
| `kr.cluster.social.local-geography.3-4` | 3-4 | 지역 지리 | 18 |
| `kr.cluster.social.local-geography.5-6` | 5-6 | 지역 지리 | 18 |
| `kr.cluster.social.local-history.3-4` | 3-4 | 지역사 | 18 |
| `kr.cluster.social.local-history.5-6` | 5-6 | 지역사 | 18 |

## Dependency Graph Review

English:

- 214 internal dependency edges.
- 40 `hard`, 174 `soft`.
- 146 `workstream-authored`, 68 `generated-cluster-adjacency`.
- No cross-subject inbound or outbound edges.

Social:

- 364 internal dependency edges.
- 288 `hard`, 76 `soft`.
- Basis distribution: 72 `requires-concept-before-source-analysis`, 72 `requires-source-analysis-before-inquiry`, 60 `continues-domain-sequence`, 6 `bridges-grade-band-depth`, 10 `cross-domain-social-studies-bridge`, 144 `generated-within-standard-order`.
- No cross-subject inbound or outbound edges.

Graph assessment: internal sequencing is coherent, especially social concept -> source -> inquiry. The graph is not yet a rich elementary curriculum graph because it lacks bridges to Korean language source reading, math/statistics, science/environment, integrated grades 1-2, moral education, and practical-arts/informatics.

## Validator vs Content Correctness

The validator proves:

- JSON schema and top-level counts pass.
- Standard keys, mappings, dependency endpoints, cluster topics, checksums, and manifest references resolve.
- English topics use subject `English as a Foreign Language`.
- Social topic text does not contain a small set of explicit foreign-default strings.

The validator does **not** prove:

- Social codes and domains match the official 2022 social-studies curriculum.
- English topics reflect actual learner load, phonological transfer needs, vocabulary limits, or classroom timing.
- Assessment prompts are grade-appropriate or teacher-reviewed.
- Culture and civics examples are locally balanced and legally precise.
- Dependency edges are pedagogically sufficient across subjects.

## Required Follow-Up Before Ship

1. Reconcile every social-studies code and summary against the official NCIC social-studies source file. Update `verificationStatus` only after exact code/domain/text checks.
2. Preserve richer workstream topic evidence in `data/kr/topics.json`, or add official source locators at topic level.
3. Replace the single English assessment template with skill-specific prompts for listening, speaking, phonics, reading, writing, interaction, media, culture, and strategy topics.
4. Add the English `[별표 4]` recommended language forms as mapped vocabulary/expression records or explicit coverage gaps tied to standard IDs.
5. Add reviewed Korean classroom examples for English culture/intercultural topics.
6. Add balanced named Korean regional examples for social geography, local history, economy/culture, civic institutions, and regional diversity.
7. Add cross-subject dependencies from integrated grades 1-2 into social 3-4, and from Korean language/math/science/moral/practical-arts records into social inquiry, data, environment, civics, and digital citizenship topics.
8. Expand `scripts/validate-kr.mjs` from shallow banned-word checks to positive Korean social-studies evidence checks and EFL-specific evidence checks.

