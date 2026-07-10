# KR Topic Content Quality and Duplication Audit

Date: 2026-07-10  
Repo: `/Volumes/data/Dev/os-taxonomy`  
Branch audited: `kr-full-depth-v0.3`  
Primary corpus: `data/kr/topics.json`, `data/kr/curriculum-standards.json`, `data/kr/dependencies.json`, `data/kr/clusters.json`

## Verdict

**No-ship for teacher-facing or learner-facing KR taxonomy content.** The KR files pass structural validation, but the topic content is still an integration candidate with substantial generated-text artifacts: exact duplicate topic records, repeated prompts, unresolved Korean particles, English facet labels in Korean-facing fields, provenance-only evidence, and incomplete source locators.

This can ship only as an internal candidate dataset if clearly labeled as generated, not reviewed, and not suitable for production curricular use.

## Structural Validation

Commands run from `/Volumes/data/Dev/os-taxonomy`:

```sh
git branch --show-current
npm run validate:kr
npm run validate
```

Results:

- `git branch --show-current` returned `kr-full-depth-v0.3`.
- `npm run validate:kr` passed: `11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters. Checksums OK.`
- `npm run validate` passed the upstream non-KR dataset: `1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.`

These results prove schema validity, reference integrity, and checksums. They do **not** prove Korean-language quality, curricular correctness, topic distinctness, or assessment usefulness.

## Scope Limit

I did not perform a line-by-line official curriculum reconciliation against live NCIC PDFs/HWP files. The repo does not include official standard text in the topic records (`sourceTextIncluded: false` on all 2,019 topics), and 1,671 topics have no `sourceLocator`. This audit therefore checks the current repository corpus, source metadata, generated topic text, duplicate signatures, and representative records. A separate source-verification pass is still required before final release.

## Corpus Counts

Full-corpus counts from `data/kr/topics.json`:

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
| **Total** | **2,019** |

Topics per source standard:

| Topics per standard | Standards |
| ---: | ---: |
| 2 | 39 |
| 3 | 491 |
| 4 | 87 |
| 5 | 24 |

Type distribution:

| Type | Topics |
| --- | ---: |
| `PROCEDURAL` | 651 |
| `CONCEPTUAL` | 572 |
| `REPRESENTATIONAL` | 370 |
| `META` | 284 |
| `LANGUAGE` | 142 |

## Findings

### 1. Exact Duplicate Topics Create False Proliferation

`name`, `title`, `titleKorean`, and `description` each have **99 exact duplicate groups covering 324 records**. All 324 are in 미술, 음악, and 체육.

Example from `data/kr/topics.json`:

- `kr.mt.art.experience.1-2.001.concept` at line 3414
- `kr.mt.art.experience.1-2.002.concept` at line 3501
- `kr.mt.art.experience.1-2.003.concept` at line 3588
- `kr.mt.art.experience.1-2.004.concept` at line 3675

All four have the same Korean-facing name, `미술 체험 1-2 concept`, and the same description pattern, `미술 1-2 학년군의 체험 학습을 한국 초등 예체능 맥락에 맞춰 다루는 concept 세부 주제입니다.`

This is not acceptable rubric reuse. It is false topic proliferation: separate standard IDs are producing indistinguishable surface topics.

### 2. Assessment Prompts Are Over-Reused

Exact duplicate `assessmentPrompt` groups:

- **209 groups**
- **642 records**
- By subject: 수학 222, 미술 108, 음악 108, 체육 108, 통합교과 96

Within the same source standard, **32 통합교과 standards covering 96 records** have exact duplicate prompts across their generated facets. Example from `data/kr/topics.json`:

- `kr.mt.integrated.right-life.who.2ba0101.01` at line 4458
- `kr.mt.integrated.right-life.who.2ba0101.02` at line 4491
- `kr.mt.integrated.right-life.who.2ba0101.03` at line 4524

All three ask the same observable task despite different facet names: 생활 맥락 이해, 바른 생활 실천, 성찰과 습관화.

Prompt-template analysis found **63 repeated templates covering 1,803 records**. The largest template groups were:

- 324 records: 예체능 `핵심 개념을 설명하고 실제 표현·감상·활동에 적용`
- 121 records each: 수학 concept, application, and representation prompt templates
- 120 records: 영어 EFL prompt template
- 102 records each: 과학 concept, procedure, and representation prompt templates

Some prompt-template reuse is acceptable when it functions as a consistent rubric family. However, exact duplicate prompts within one source standard, and prompts attached to exact duplicate topic names, fail the distinct-teachable-topic test.

Generic filler checks also found broad phrase reuse:

- 936 records contain the generic phrase `세부 주제` in Korean-facing text.
- 324 예체능 records contain `한국 초등 예체능 맥락에 맞춰 다루는`, `핵심 개념을 설명하고`, and `실제 표현·감상·활동에 적용`, without standard-specific observable behavior.
- 348 국어 records reuse the broad observation phrase `기준으로 관찰한다`; these records have more plausible facet labels than 예체능, but still need human rewriting before publication.

### 3. Malformed Korean Is Widespread

Unresolved Korean particle placeholders appear in **1,152 records**:

| Pattern | Records | Occurrences |
| --- | ---: | ---: |
| `을/를` | 612 | 1,128 |
| `이/가` | 672 | 672 |
| `이(가)` | 216 | 216 |
| `을(를)` | 216 | 216 |

Affected subjects:

| Subject | Records |
| --- | ---: |
| 국어 | 348 |
| 사회 | 216 |
| 통합교과 | 144 |
| 영어 | 120 |
| 미술 | 108 |
| 음악 | 108 |
| 체육 | 108 |

Representative malformed records:

- `kr.mt.korean.listening-speaking.1-2.2guk0101.01` at `data/kr/topics.json:10`: `듣기·말하기을/를`, `의사소통을/를`, and prompt suffix `이/가`.
- `kr.mt.english-efl.3-4.understanding.4영01-01.01.알파벳-소리와-글자-이름-듣기-식별` at `data/kr/topics.json:35196`: `식별을/를`.
- `kr.mt.social.local-geography.3-4.01.concept` at `data/kr/topics.json:26796`: parenthetical particles `이(가)` and `을(를)`.
- `kr.mt.practical.human-development-self-directed-life.5-6.0101.concept` at `data/kr/topics.json:60370`: `조건와` and `존중를`.

Additional malformed phrase checks found `하기과` in 15 records, `존중를` in 4 records, and `조건와` in 1 record.

### 4. Mixed English Facet Labels Remain in Korean-Facing Fields

English appears in Korean-facing fields (`name`, `titleKorean`, `description`, `summary`, `assessmentPrompt`) in 448 records. This includes acceptable or context-dependent cases such as 영어 EFL, `DMZ`, and three 실과/정보 `AI` records, but **324 records have English facet labels directly in Korean topic names and Korean titles**:

- `kr.mt.art.experience.1-2.001.concept` at `data/kr/topics.json:3414`: `미술 체험 1-2 concept`
- `kr.mt.music.expression.1-2.001.concept` at `data/kr/topics.json:10410`: `음악 표현 1-2 concept`
- `kr.mt.physical-education.health.1-2.001.concept` at `data/kr/topics.json:13038`: `체육 건강 1-2 concept`

The 예체능 records also have empty `verificationStatus`, no `sourceLocator`, repeated names, and repeated descriptions. These should be treated as draft placeholders, not publishable Korean topic content.

### 5. Evidence Is Provenance, Not Observable Mastery Evidence

Every topic has exactly one `evidence` entry, and all 2,019 entries use:

```text
source-to-topic-decomposition
```

There are:

- 0 topics with more than one evidence entry
- 0 topics with learner-observable mastery evidence in `evidence[]`
- 641 exact evidence-object groups, one per source standard, covering all 2,019 topics

Example issue:

- `kr.mt.moral.self-agency.g3-4.4do-01-01.case` at `data/kr/topics.json:23832` has a reasonable moral-education topic shape, but its `evidence[]` only states that it was decomposed from `[4도01-01]`; it does not provide mastery criteria for case reading.

This is a structural pass but a content-quality fail. The original non-KR README describes `evidence` as observable mastery criteria. The KR dataset currently uses `evidence` as provenance.

### 6. Source Traceability Is Incomplete

From all 2,019 topics:

- `sourceTextIncluded: false`: 2,019
- Missing `sourceLocator`: 1,671
- Missing `generationBasis`: 1,527
- Empty `verificationStatus`: 324
- `official-source-checked`: 1,257, but 909 of those lack `sourceLocator`

By subject:

| Subject | Topics | `sourceLocator` present | `generationBasis` present | Status summary |
| --- | ---: | ---: | ---: | --- |
| 국어 | 348 | 348 | 348 | `official-source-checked`: 348 |
| 수학 | 363 | 0 | 0 | `official-source-checked`: 363 |
| 과학 | 306 | 0 | 0 | `official-source-checked`: 306 |
| 도덕 | 120 | 0 | 0 | `official-source-checked`: 120 |
| 영어 | 120 | 0 | 0 | `official-source-checked`: 120 |
| 사회 | 216 | 0 | 0 | `public-doc-derived`: 216 |
| 통합교과 | 144 | 0 | 144 | `public-doc-derived`: 144 |
| 실과(기술·가정)/정보 | 78 | 0 | 0 | `public-doc-derived`: 78 |
| 미술 | 108 | 0 | 0 | empty: 108 |
| 음악 | 108 | 0 | 0 | empty: 108 |
| 체육 | 108 | 0 | 0 | empty: 108 |

The source posture is honest in some places, but the dataset should not mark records as release-ready while most records cannot be traced to an exact locator.

### 7. Near-Duplicate Detection Found One Strict Text Pair Family, But Template Duplication Is the Larger Risk

Strict near-duplicate `name` similarity, excluding exact duplicates, found **3 near-duplicate pairs covering 6 records**:

- `kr.mt.science.life.animal-life.g4-02-03.concept` at `data/kr/topics.json:14937`
- `kr.mt.science.life.plant-life.g4-03-03.concept` at `data/kr/topics.json:15234`
- plus matching `procedure` and `representation` records at lines 14970, 15003, 15267, and 15300

These compare animal and plant traits used to design 생활용품. This appears to be parallel curricular structure rather than an obvious duplicate, but it needs a subject review to ensure the plant and animal records require distinct evidence and examples.

The larger near-duplicate problem is deterministic facet templating:

| Facet set | Standards |
| --- | ---: |
| `application|concept|representation` | 121 |
| `concept|practice|reflection` | 108 |
| `concept|procedure|representation` | 102 |
| `01|02|03|04` | 87 |
| `concept|inquiry|source` | 72 |
| `01|02|03` | 48 |
| `concept|practice` | 39 |
| `case|concept|dialogue|inquiry|reflection` | 24 |

All 641 standards have identical evidence objects across their generated facets. The facet sets are not automatically wrong, but many records need content-specific evidence to prove that each facet is a distinct teachable idea.

### 8. Topic Granularity Is Often Target-Driven

The corpus expands 641 standards into 2,019 topics, with most standards producing exactly 3 topics. This is useful for graph density, but the content shows several target-driven expansions:

- 예체능 records multiply by concept/practice/reflection while keeping duplicate names and descriptions across source standards.
- 통합교과 records split into three facet names, but 32 standards reuse the exact same prompt for all three facets.
- 수학 and 과학 facet families are more defensible because concept, procedure/application, and representation can be distinct teachable roles, but the prompt and evidence fields still need review.
- 도덕 has the strongest facet separation in sampled records (`case`, `concept`, `dialogue`, `inquiry`, `reflection`), but still lacks observable evidence in `evidence[]`.
- 국어 has reasonably distinct four-part decomposition in sampled records, but Korean surface quality is not publishable because all 348 국어 records contain unresolved particles.

## Manual Subject Inspection

Representative records were manually inspected across every subject:

| Subject | Sample record(s) | Assessment |
| --- | --- | --- |
| 국어 | `kr.mt.korean.listening-speaking.1-2.2guk0101.01` (`data/kr/topics.json:10`) | Source locator is present and four facets are plausible, but malformed Korean particles appear in description and prompt. |
| 수학 | `kr.mt.math.number-operations.g1-2.s2-01-01.application` (`data/kr/topics.json:6042`) | Granularity is plausible, but prompt templates repeat heavily and source locator is absent. |
| 과학 | `kr.mt.science.life.animal-life.g4-02-03.concept` (`data/kr/topics.json:14937`), `kr.mt.science.life.plant-life.g4-03-03.concept` (`data/kr/topics.json:15234`) | Parallel standards are near-duplicates by title; likely acceptable only if subject examples and evidence are made distinct. |
| 사회 | `kr.mt.social.local-geography.3-4.01.concept` (`data/kr/topics.json:26796`) | Korea-centered framing is present, but parenthetical particles remain and records are `public-doc-derived` without source locators. |
| 영어 | `kr.mt.english-efl.3-4.understanding.4영01-01.01.알파벳-소리와-글자-이름-듣기-식별` (`data/kr/topics.json:35196`) | EFL orientation is appropriate, but all 120 EFL prompts share one template and particles remain unresolved. |
| 도덕 | `kr.mt.moral.self-agency.g3-4.4do-01-01.case` (`data/kr/topics.json:23832`) | Facet design is stronger than most subjects, but evidence is still only decomposition provenance. |
| 실과(기술·가정)/정보 | `kr.mt.practical.human-development-self-directed-life.5-6.0101.concept` (`data/kr/topics.json:60370`) | Topic direction is plausible, but malformed particles (`조건와`, `존중를`) and missing locator block release. |
| 통합교과 | `kr.mt.integrated.right-life.who.2ba0101.01` (`data/kr/topics.json:4458`) | Three generated facets have the exact same prompt, so assessment does not distinguish the facets. |
| 미술 | `kr.mt.art.experience.1-2.001.concept` (`data/kr/topics.json:3414`) | No-ship placeholder: English facet label, duplicate names/descriptions, empty verification status, no locator. |
| 음악 | `kr.mt.music.expression.1-2.001.concept` (`data/kr/topics.json:10410`) | Same no-ship placeholder pattern as 미술. |
| 체육 | `kr.mt.physical-education.health.1-2.001.concept` (`data/kr/topics.json:13038`) | Same no-ship placeholder pattern as 미술. |

## Source URLs Referenced by the Repository

The source metadata in `data/kr/curriculum-standards.json` cites these primary URLs:

- Ministry of Education: https://www.moe.go.kr/
- NCIC portal: https://ncic.re.kr/
- NCIC domestic curriculum inventory: https://ncic.re.kr/inv/org/list.do
- NCIC 2022 revised curriculum notice list: https://ncic.re.kr/bbs/eduNotice2022/list.do
- NCIC 2022 notice 543: https://ncic.re.kr/bbs/eduNotice2022/view/543.do?searchword=&searchkey=&page=1
- NCIC 2026 amendment notice 1864: https://ncic.re.kr/bbs/eduNotice2022/view/1864.do?searchword=&searchkey=&page=1
- NCIC copyright/reuse policy: https://ncic.re.kr/mbr/policy.do
- 국어 [별책5] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003553&orgType=ogi4
- 통합교과 [별책15] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003571&orgType=ogi4
- 수학 [별책8] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003559&orgType=ogi4
- 과학 [별책9] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003551&orgType=ogi4
- 영어 [별책14] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003794&orgType=ogi4
- 도덕 [별책6] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003738&orgType=ogi4
- 실과(기술·가정)/정보 [별책10] download: https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003781&orgType=ogi4

One source is explicitly local rather than an official URL:

- `kr-project-v03-social-seed`: `file:data/kr/curriculum-standards.seed.json`

## Reproducible Analysis Commands

Validation:

```sh
npm run validate:kr
npm run validate
```

Core corpus count:

```sh
node --input-type=module -e "import fs from 'node:fs'; const topics=JSON.parse(fs.readFileSync('data/kr/topics.json','utf8')).topics; console.log(topics.length);"
```

Full-corpus duplicate, malformed Korean, English-label, evidence, generic-filler, and source-traceability checks:

```sh
node --input-type=module <<'NODE'
import fs from 'node:fs';
const topics = JSON.parse(fs.readFileSync('data/kr/topics.json', 'utf8')).topics;
const norm = (v) => String(v ?? '').trim().replace(/\s+/g, ' ');
const group = (items, keyFn) => {
  const m = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(item);
  }
  return [...m.values()].filter((xs) => xs.length > 1);
};
const countBy = (items, keyFn) => [...items.reduce((m, x) => m.set(keyFn(x), (m.get(keyFn(x)) || 0) + 1), new Map())].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
const dupSummary = (field) => {
  const groups = group(topics, (t) => norm(t[field]));
  return { field, groups: groups.length, records: groups.reduce((n, xs) => n + xs.length, 0) };
};
const krFields = ['name', 'titleKorean', 'description', 'summary', 'assessmentPrompt'];
const particlePatterns = ['을/를', '이/가', '이(가)', '을(를)'];
const particle = Object.fromEntries(particlePatterns.map((p) => [p, { records: 0, occurrences: 0 }]));
const malformed = new Map();
for (const t of topics) {
  const text = krFields.map((f) => t[f] ?? '').join('\n');
  for (const p of particlePatterns) {
    const re = new RegExp(p.replace(/[()]/g, '\\$&'), 'g');
    const n = (text.match(re) || []).length;
    if (n) { particle[p].records += 1; particle[p].occurrences += n; }
  }
  for (const p of ['하기과', '존중를', '조건와']) if (text.includes(p)) malformed.set(p, (malformed.get(p) || 0) + 1);
}
const withParticle = topics.filter((t) => particlePatterns.some((p) => krFields.map((f) => t[f] ?? '').join('\n').includes(p)));
const englishInKr = topics.filter((t) => /[A-Za-z]/.test(krFields.map((f) => t[f] ?? '').join('\n')));
const englishFacet = topics.filter((t) => /\b(concept|practice|reflection|procedure|representation|application|inquiry|source|case|dialogue)\b/i.test(`${t.name ?? ''}\n${t.titleKorean ?? ''}`));
const evidenceGroups = group(topics, (t) => JSON.stringify(t.evidence ?? []));
const sameStdPrompt = group(topics, (t) => `${t.standards?.[0] ?? ''}\u0000${norm(t.assessmentPrompt)}`);
const standardGroups = group(topics, (t) => t.standards?.[0] ?? t.sourceStandardCode ?? '');
const fillerPatterns = ['세부 주제', '마이크로토픽', '기준으로 관찰한다', '핵심 개념을 설명하고', '실제 표현·감상·활동에 적용', '한국 초등 예체능 맥락에 맞춰 다루는'];
const filler = Object.fromEntries(fillerPatterns.map((p) => [p, topics.filter((t) => ['description', 'summary', 'assessmentPrompt'].some((f) => String(t[f] ?? '').includes(p))).length]));
console.log(JSON.stringify({
  total: topics.length,
  subjectCounts: countBy(topics, (t) => t.subjectKorean),
  topicsPerStandard: countBy(standardGroups, (xs) => xs.length),
  typeCounts: countBy(topics, (t) => t.type),
  exactDuplicates: ['name', 'title', 'titleKorean', 'description'].map(dupSummary),
  duplicateAssessmentPrompts: dupSummary('assessmentPrompt'),
  sameStandardDuplicatePrompt: { groups: sameStdPrompt.length, records: sameStdPrompt.reduce((n, xs) => n + xs.length, 0) },
  unresolvedParticles: { anyRecordCount: withParticle.length, patterns: particle, bySubject: countBy(withParticle, (t) => t.subjectKorean) },
  malformed: Object.fromEntries([...malformed].sort()),
  englishInKoreanFacingFields: englishInKr.length,
  englishFacetLabelsInNames: englishFacet.length,
  evidence: {
    oneEntry: topics.filter((t) => (t.evidence ?? []).length === 1).length,
    moreThanOneEntry: topics.filter((t) => (t.evidence ?? []).length > 1).length,
    sourceToTopicOnly: topics.filter((t) => (t.evidence ?? []).every((e) => e.evidenceType === 'source-to-topic-decomposition')).length,
    duplicateEvidenceGroups: evidenceGroups.length,
    duplicateEvidenceRecords: evidenceGroups.reduce((n, xs) => n + xs.length, 0)
  },
  source: {
    sourceTextIncludedFalse: topics.filter((t) => t.sourceTextIncluded === false).length,
    missingSourceLocator: topics.filter((t) => !t.sourceLocator).length,
    missingGenerationBasis: topics.filter((t) => !t.generationBasis).length,
    emptyVerificationStatus: topics.filter((t) => !t.verificationStatus).length,
    officialSourceCheckedNoLocator: topics.filter((t) => t.verificationStatus === 'official-source-checked' && !t.sourceLocator).length
  },
  filler
}, null, 2));
NODE
```

Representative line anchors were collected with:

```sh
rg -n 'kr\.mt\.(korean\.listening-speaking\.1-2\.2guk0101\.01|art\.experience\.1-2\.001\.concept|music\.expression\.1-2\.001\.concept|physical-education\.health\.1-2\.001\.concept|integrated\.right-life\.who\.2ba0101\.01|math\.number-operations\.g1-2\.s2-01-01\.application|science\.life\.animal-life\.g4-02-03\.concept|science\.life\.plant-life\.g4-03-03\.concept|social\.local-geography\.3-4\.01\.concept|english-efl\.3-4\.understanding\.4영01-01\.01|practical\.human-development-self-directed-life\.5-6\.0101\.concept|moral\.self-agency\.g3-4\.4do-01-01\.case)' data/kr/topics.json
```

## Release Blockers

1. Replace unresolved particle placeholders and malformed Korean across all affected subjects.
2. Collapse or rewrite exact duplicate 예체능 topics so each standard produces distinct Korean topic names, descriptions, evidence, and prompts.
3. Replace English facet labels in Korean-facing fields, especially 미술/음악/체육.
4. Split repeated prompts where generated facets are supposed to measure different teachable ideas.
5. Convert `evidence[]` from provenance notes into observable mastery evidence, while preserving provenance in separate fields.
6. Add exact `sourceLocator` and `generationBasis` coverage for all records marked `official-source-checked`.
7. Run a source reconciliation pass against official NCIC/MOE documents before changing release status.
