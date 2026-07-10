# KR Official-Source and Provenance Deep Audit

Date: 2026-07-10  
Repository: `/Volumes/data/Dev/os-taxonomy`  
Branch: `kr-full-depth-v0.3`  
Commit: `873124e45f7e8cb3aaa95c3afc6f1b3982e68d6b`  
Primary target: `data/kr/curriculum-standards.json`  
Audit posture: read-only inspection; this report is the only file created by this audit.

## Ship Verdict

**NO-SHIP** as a canonical, complete, teacher-facing, learner-facing, or generally/commercially redistributable Korean 2022 revised-curriculum taxonomy.

The repository's structural validators pass, and the seven curricula marked `official-source-checked` have strong **base-2022 code-inventory support**: all 461 of their 461 codes occur in the cited NCIC-hosted Ministry of Education PDFs. That is a real positive result, not merely a status-label assertion.

The complete release nevertheless fails on four independent grounds:

1. **92 of 641 dataset codes are not present in the corresponding base-2022 official PDFs.** These are 45 social-studies codes, 12 art codes, 12 music codes, and 23 physical-education codes. The official PDFs also contain 62 elementary codes omitted by the dataset.
2. **The social-studies code families and summaries are structurally synthetic.** Only 27 of the dataset's 72 social codes occur in the official Annex 7 PDF, and identical code strings often carry unrelated official meaning. For example, dataset `[4사02-02]` is terrain/geography while official `[4사02-02]` concerns historical evidence; dataset `[4사05-01]` is classroom rules while official `[4사05-01]` concerns map elements.
3. **The current accessible amendment is missing.** NCIC's 2026.01 elementary branch exposes an amended Annex 15, attachment `10004214`, titled `교육부 고시 제2022-33호 [별책 15] (국가교육위원회 고시 제2026-1호 일부개정 포함)`. It adds `건강한 생활` and nine `[2건..]` standards. The dataset was generated on 2026-07-09 but omits all nine, and both the schema and validator reject the `건` subject character.
4. **KR licensing/provenance is not release-ready.** `PROVENANCE.md` has no Korean/NCIC/MOE section, while the live NCIC copyright policy says freely usable works must carry an applicable KOGL mark, identifies KOGL Type 2 as non-commercial, and requires attribution. The dataset records no work-specific KOGL mark, license type, or permission evidence for the eleven PDFs. The repository-level commercial-friendly ODbL/CC BY-SA explanation therefore does not establish rights for the KR source-derived layer.

A narrowly labeled internal research candidate may be retained, but it must not be represented as a complete or verified current Korean curriculum release.

## Task Evaluation Guidance Packet

| Field | Content |
|---|---|
| Task intent | Determine whether all 641 KR achievement-standard anchors and their `verificationStatus`, `sourceBasis`, and `sourceRefs` are supported by accessible official Korean 2022 revised-curriculum sources. |
| Audience/use | Release/ship decision for repository maintainers and downstream taxonomy consumers. |
| Required content | Every source record; live URL checks; all-subject/status stratification; reproducible exact sample; code and semantic support; licensing/provenance; explicit structural-vs-content distinction. |
| Required exclusions | No edits to data, scripts, schema, docs, package metadata, git state, or source records; no claim that a validator pass proves curricular correctness; no legal conclusion beyond documented evidence gaps. |
| Domain anchors | NCIC inventory APIs, eleven base-2022 official PDFs, the current 2026 amended Annex 15, live NCIC copyright policy, repository source metadata, validator, schema, README, and `PROVENANCE.md`. |
| Failure traps | Treating code-shaped strings as official codes; treating a generic portal URL as record-level evidence; accepting `official-source-checked` as proof; overlooking current amendments; treating public availability as a commercial reuse license. |
| Verification evidence | Exact commands and URLs below; PDF byte sizes, pages, SHA-256 values, full code-set comparison, exact 175-record sample, source-record table, and representative official-text contexts. |
| Learn-back target if failed | Source records and KR standards must be rebuilt; schema/validator and provenance policy must be updated before release. |

Verification tier: **Tier 3 / high-stakes public factual and licensing claims**. A compact claim ledger is included near the end of this report because the task permits only this named audit file.

## Scope and Files Inspected

Primary repository evidence:

- `data/kr/curriculum-standards.json`
- `data/kr/manifest.json`
- `data/kr/curriculum-standards.seed.json`
- all nine files under `data/kr/workstreams/`
- `scripts/validate-kr.mjs`
- `schema/kr-curriculum-standards.schema.json`
- `docs/kr-curriculum-mapping-method.md`
- `README.md`
- `PROVENANCE.md`
- `LICENSE`
- `LICENSE-CONTENT`
- `package.json`

Existing audit evidence inspected and independently rechecked where relevant:

- `audits/2026-07-10-validator-repro-audit.md`
- `audits/2026-07-10-graph-audit.md`
- `audits/2026-07-10-efl-social-context-audit.md`
- `audits/2026-07-10-topic-quality-audit.md`

Official-source evidence inspected:

- NCIC domestic curriculum inventory UI: `https://ncic.re.kr/inv/org/list.do`
- NCIC inventory tree API: `https://ncic.re.kr/api/inv/inventoryNodeList.do`
- NCIC attachment API: `https://ncic.re.kr/api/inv/invFileList.do`
- eleven base-2022 subject PDFs identified below
- current amended integrated-subject PDF attachment `10004214`
- NCIC copyright policy: `https://ncic.re.kr/mbr/policy.do`
- MOE homepage: `https://www.moe.go.kr/` (current browser route resolves to `https://www.moe.go.kr/main.do?s=moe`)

## Methodology and Reproduction

### 1. Repository and structural baseline

Commands:

```sh
git branch --show-current
git rev-parse HEAD
git status --short
npm run validate:kr
npm run validate
```

Observed validator output:

```text
✓ KR full-depth data valid - 11 curricula, 641 standards, 2019 topics, 2723 dependencies, 155 clusters. Checksums OK.
✓ valid — 1590 topics, 3221 dependencies, 3261 standards, 183 clusters. Referential integrity + checksums OK.
```

This is a **structural smoke-test pass only**. `scripts/validate-kr.mjs:17-18` accepts enumerated status strings and any code matching a shape regex; `scripts/validate-kr.mjs:68-77` checks keys, shape, nonempty summaries/sourceBasis, and source-ID existence. It does not query NCIC, compare official code inventories, evaluate semantic meaning, enforce the JSON Schema, inspect current amendments, or establish licensing.

### 2. Official inventory discovery

The 2022.12 elementary branch was queried through NCIC's live inventory API:

```sh
curl -sS -L -A 'Mozilla/5.0' -X POST \
  'https://ncic.re.kr/api/inv/inventoryNodeList.do' \
  --data 'type=ogi4&nowTblType=dwn&menuType=1&invDepth=3&degreeCode=1014&classCode=1002&openYear=2022&openMonth=12&nationCode=&isAdmin=0'
```

Relevant subject codes returned by the official API:

| Subject | NCIC `subjectCode` | PDF attachment |
|---|---:|---:|
| 국어 | `1713` | `10003553` |
| 수학 | `2511` | `10003559` |
| 영어 | `3360` | `10003794` |
| 사회 | `2304` | `10003800` |
| 도덕 | `3311` | `10003738` |
| 과학 | `1306` | `10003551` |
| 체육 | `3009` | `10003695` |
| 음악 | `2801` | `10003561` |
| 미술 | `2201` | `10003555` |
| 실과(기술 · 가정)/정보 | `3396` | `10003781` |
| 바른 생활, 슬기로운 생활, 즐거운 생활 | `3363` | `10003571` |

Each attachment was confirmed with:

```sh
curl -sS -L -A 'Mozilla/5.0' -X POST \
  'https://ncic.re.kr/api/inv/invFileList.do' \
  --data 'orgType=ogi4&degreeCode=1014&classCode=1002&openYear=2022&openMonth=12&subjectCode=<subjectCode>&type=dwn'
```

### 3. PDF fingerprint and full-population code comparison

For each official attachment:

```sh
curl -sS -L -A 'Mozilla/5.0' \
  'https://ncic.re.kr/inv/org/download.do?year=2022&seq=<attachmentNo>&orgType=ogi4' \
  | pdftotext -layout - -
```

The fetched bytes were SHA-256 hashed and passed to `pdfinfo -`. Unique elementary code strings were extracted with this audit regex:

```regex
\[[246](국|수|과|사|영|도|실|바|슬|즐|미|음|체)[0-9]{2}-[0-9]{2}\]
```

The official and dataset sets were compared for **all 641 records**, not sampled.

### 4. Reproducible semantic/provenance sample

The content/source-reference sample contains 175 of 641 records (27.30%). It is stratified across every subject and both standard-level verification statuses.

Selection algorithm:

1. seed = `2026-07-10-source-provenance-audit|873124e45f7e8cb3aaa95c3afc6f1b3982e68d6b`
2. within each subject, compute `SHA256(seed + "|" + standard.key)`;
3. sort ascending by digest, then by key;
4. take the quota below.

| Subject | Status | Population | Sample |
|---|---|---:|---:|
| 국어 | `official-source-checked` | 87 | 25 |
| 수학 | `official-source-checked` | 121 | 25 |
| 과학 | `official-source-checked` | 102 | 25 |
| 영어 | `official-source-checked` | 40 | 15 |
| 도덕 | `official-source-checked` | 24 | 10 |
| 실과(기술·가정)/정보 | `official-source-checked` | 39 | 10 |
| 통합교과 | `official-source-checked` | 48 | 15 |
| 사회 | `needs-official-code-check` | 72 | 20 |
| 미술 | `needs-official-code-check` | 36 | 10 |
| 음악 | `needs-official-code-check` | 36 | 10 |
| 체육 | `needs-official-code-check` | 36 | 10 |
| **Total** |  | **641** | **175** |

The audit intentionally sampled more `official-source-checked` records in absolute count (125) than candidate records (50), because the stronger label requires independent scrutiny. Under simple-random assumptions, the deterministic hash sample has a worst-case 95% margin of error of approximately ±6.32 percentage points overall, ±7.49 points for the 125/461 official-status sample, and ±11.81 points for the 50/180 candidate-status sample. Hash ranking is used for reproducibility and dispersion; those margins are descriptive, not a substitute for curriculum-specialist review.

Sample verdict rules:

- **PASS**: code exists in the governing PDF, grade/domain/subtopic locator and summary are materially supported, and `sourceRefs` include a subject PDF record.
- **PARTIAL**: the code exists and the summary has only broad overlap, but material details are not directly supported.
- **FAIL**: code is absent, the official meaning is mismatched, the summary is a generic non-standard placeholder, or no direct subject-source evidence exists.

## Corpus Stratification

### Standards by subject and status

| Subject | Standards | `official-source-checked` | `needs-official-code-check` | Direct subject-PDF ref |
|---|---:|---:|---:|---:|
| 국어 | 87 | 87 | 0 | 87 |
| 수학 | 121 | 121 | 0 | 121 |
| 과학 | 102 | 102 | 0 | 102 |
| 영어 | 40 | 40 | 0 | 40 |
| 도덕 | 24 | 24 | 0 | 24 |
| 실과(기술·가정)/정보 | 39 | 39 | 0 | 39 |
| 통합교과 | 48 | 48 | 0 | 48 |
| 사회 | 72 | 0 | 72 | 0 |
| 미술 | 36 | 0 | 36 | 0 |
| 음악 | 36 | 0 | 36 | 0 |
| 체육 | 36 | 0 | 36 | 0 |
| **Total** | **641** | **461** | **180** | **461** |

There are no standard records with `public-doc-derived`; that status appears at the topic layer, not among the 641 standards.

### Item-level locator posture

- 국어: 87/87 have `sourceLocator`, `sourceSection`, and verification notes.
- 수학: 121/121 have evidence objects with PDF extraction locators and subtopic bases.
- 과학: 102/102 have evidence objects; the workstream also admits that its local PDF/extract was not vendored.
- 도덕: 24/24 have evidence/notes; some locators refer to a local extraction workflow.
- 실과: 39/39 have evidence objects.
- 통합교과: 48/48 have `sourceSection` and evidence objects.
- 영어: 0/40 have a per-record `sourceLocator` or evidence object. The source record gives only four broad extraction-line ranges in a non-vendored “local verification copy” (`data/kr/curriculum-standards.json:101-104`).
- 사회/미술/음악/체육: 0/180 have direct official subject-PDF refs.

## Full Official-PDF Code Results

### Base-2022 source comparison

| Subject | Attachment | Bytes | Pages | SHA-256 | Dataset | Official | Intersection | Dataset-only | Official-only |
|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 국어 | `10003553` | 2,078,590 | 222 | `5c30ae42a973a8f912bae156b160cd16d56636b3a64af84c3bdc378c9b482544` | 87 | 87 | 87 | 0 | 0 |
| 수학 | `10003559` | 1,938,993 | 263 | `ba7c7c63ad31ba0fd32e5eb8148d696dd73288acce111495c593298112f8f840` | 121 | 121 | 121 | 0 | 0 |
| 과학 | `10003551` | 2,663,278 | 292 | `0cf53427691d54366d6805767c428a15b0e817580807b4354947de7e3b58b738` | 102 | 102 | 102 | 0 | 0 |
| 사회 | `10003800` | 4,332,996 | 316 | `a852e8da3e6aea7d1c95690dcae140be02e014b779ac2e5cc0801200cfb16923` | 72 | 49 | 27 | 45 | 22 |
| 영어 | `10003794` | 2,313,266 | 306 | `596d13897b002a4279a3e21f16396bdae7ac74988450f45fb348f87af943f92a` | 40 | 40 | 40 | 0 | 0 |
| 도덕 | `10003738` | 1,412,105 | 92 | `0682710d786a0be26efdfbd835195e4871c71bc7c3c11f71427c7087c07a850e` | 24 | 24 | 24 | 0 | 0 |
| 실과(기술·가정)/정보 | `10003781` | 2,956,125 | 222 | `842077c76b311f23d57e6e749a8e4ffbb3d59d37628c1646531301022cc36bfd` | 39 | 39 | 39 | 0 | 0 |
| 통합교과 (base) | `10003571` | 1,152,492 | 54 | `5fe191f258d11cc77741c57cfb16324b26d5db14649809cc694dcbcd4662adee` | 48 | 48 | 48 | 0 | 0 |
| 미술 | `10003555` | 1,983,114 | 76 | `b47363c9a1060b00777c6de555d972b509b64b886d7beca89460a552a33c77b2` | 36 | 26 | 24 | 12 | 2 |
| 음악 | `10003561` | 2,337,694 | 96 | `db2d03b4e2accfd442ca1297b84e43061feb1422659914e486e27f7b555f7bd6` | 36 | 26 | 24 | 12 | 2 |
| 체육 | `10003695` | 2,371,909 | 125 | `49cdef2bbcdf1decb796204ab66a0b6a308cd2903ead7168dde892b1f48cf2fb` | 36 | 49 | 13 | 23 | 36 |
| **Total** |  |  |  |  | **641** | **611** | **549** | **92** | **62** |

Base-2022 code-inventory pass rate: **549/641 (85.65%)**.  
Base-2022 dataset-only rate: **92/641 (14.35%)**.  
Within `needs-official-code-check`: **92/180 (51.11%)** codes are dataset-only.

### Current 2026 amendment check

The repository source record `kr-ncic-2026-amendment-notice-1864` is a 404, but the official inventory API itself exposes the current branch:

```sh
curl -sS -L -A 'Mozilla/5.0' -X POST \
  'https://ncic.re.kr/api/inv/inventoryNodeList.do' \
  --data 'type=ogi4&nowTblType=dwn&menuType=1&invDepth=3&degreeCode=1014&classCode=1002&openYear=2026&openMonth=01&nationCode=&isAdmin=0'
```

It returns:

```text
총론                                               subjectCode=1100
바른 생활. 슬기로운 생활. 건강한 생활. 즐거운 생활  subjectCode=3417
```

The current integrated-subject PDF is:

- URL: `https://ncic.re.kr/inv/org/download.do?year=2026&seq=10004214&orgType=ogi4`
- attachment: `10004214`
- bytes: `1,449,216`
- pages: `90`
- SHA-256: `39954a4b5605b0ee691bd1a13e8207568ecb9079c97cdd6bf4ef490a7b7a41c6`
- header: `교육부 고시 제2022-33호 [별책 15] (국가교육위원회 고시 제2026-1호 일부개정 포함)`
- code inventory: 16 바른 생활 + 16 슬기로운 생활 + 9 건강한 생활 + 16 즐거운 생활 = **57**

New official codes omitted by the dataset:

```text
[2건01-01] [2건01-02]
[2건02-01] [2건02-02] [2건02-03] [2건02-04] [2건02-05]
[2건03-01] [2건03-02]
```

All 48 existing 바/슬/즐 codes remain present, so their individual base records are not invalidated. The corpus is nevertheless incomplete against the current accessible source. The current official total is therefore 620 rather than 611, and the current official-only gap is **71** rather than 62.

The current schema and validator cannot represent the amendment: `schema/kr-curriculum-standards.schema.json:143` and `scripts/validate-kr.mjs:18` omit `건` from the accepted subject-code character set.

## Exact Synthetic and Omitted Code Sets

### 사회

- dataset-only (45): `[4사01-03]`, `[4사01-04]`, `[4사01-05]`, `[4사01-06]`, `[4사02-04]`, `[4사02-05]`, `[4사02-06]`, `[4사03-03]`, `[4사03-04]`, `[4사03-05]`, `[4사03-06]`, `[4사04-04]`, `[4사04-05]`, `[4사04-06]`, `[4사05-03]`, `[4사05-04]`, `[4사05-05]`, `[4사05-06]`, `[4사06-03]`, `[4사06-04]`, `[4사06-05]`, `[4사06-06]`, `[6사01-03]`, `[6사01-04]`, `[6사01-05]`, `[6사01-06]`, `[6사02-03]`, `[6사02-04]`, `[6사02-05]`, `[6사02-06]`, `[6사03-03]`, `[6사03-04]`, `[6사03-05]`, `[6사03-06]`, `[6사04-04]`, `[6사04-05]`, `[6사04-06]`, `[6사05-03]`, `[6사05-04]`, `[6사05-05]`, `[6사05-06]`, `[6사06-03]`, `[6사06-04]`, `[6사06-05]`, `[6사06-06]`
- official-only (22): `[4사07-01]`, `[4사07-02]`, `[4사08-01]`, `[4사08-02]`, `[4사09-01]`, `[4사09-02]`, `[4사10-01]`, `[4사10-02]`, `[6사07-01]`, `[6사07-02]`, `[6사08-01]`, `[6사08-02]`, `[6사08-03]`, `[6사09-01]`, `[6사09-02]`, `[6사10-01]`, `[6사10-02]`, `[6사11-01]`, `[6사11-02]`, `[6사11-03]`, `[6사12-01]`, `[6사12-02]`

### 미술

- dataset-only (12): `[2미01-01]`, `[2미01-02]`, `[2미01-03]`, `[2미01-04]`, `[2미02-01]`, `[2미02-02]`, `[2미02-03]`, `[2미02-04]`, `[2미03-01]`, `[2미03-02]`, `[2미03-03]`, `[2미03-04]`
- official-only (2): `[4미02-05]`, `[6미02-05]`

### 음악

- dataset-only (12): `[2음01-01]`, `[2음01-02]`, `[2음01-03]`, `[2음01-04]`, `[2음02-01]`, `[2음02-02]`, `[2음02-03]`, `[2음02-04]`, `[2음03-01]`, `[2음03-02]`, `[2음03-03]`, `[2음03-04]`
- official-only (2): `[4음02-05]`, `[6음02-05]`

### 체육

- dataset-only (23): `[2체01-01]`, `[2체01-02]`, `[2체01-03]`, `[2체02-01]`, `[2체02-02]`, `[2체02-03]`, `[2체03-01]`, `[2체03-02]`, `[2체03-03]`, `[2체04-01]`, `[2체04-02]`, `[2체04-03]`, `[2체05-01]`, `[2체05-02]`, `[2체05-03]`, `[4체04-01]`, `[4체04-02]`, `[4체05-01]`, `[4체05-02]`, `[6체04-01]`, `[6체04-02]`, `[6체05-01]`, `[6체05-02]`
- official-only (36): `[4체01-04]`, `[4체01-05]`, `[4체01-06]`, `[4체02-03]`, `[4체02-04]`, `[4체02-05]`, `[4체02-06]`, `[4체02-07]`, `[4체02-08]`, `[4체02-09]`, `[4체02-10]`, `[4체03-03]`, `[4체03-04]`, `[4체03-05]`, `[4체03-06]`, `[4체03-07]`, `[6체01-03]`, `[6체01-04]`, `[6체01-05]`, `[6체01-06]`, `[6체02-03]`, `[6체02-04]`, `[6체02-05]`, `[6체02-06]`, `[6체02-07]`, `[6체02-08]`, `[6체02-09]`, `[6체02-10]`, `[6체02-11]`, `[6체02-12]`, `[6체03-03]`, `[6체03-04]`, `[6체03-05]`, `[6체03-06]`, `[6체03-07]`, `[6체03-08]`

The 39 standalone grade-1-2 미술/음악/체육 codes (12 art + 12 music + 15 PE) are especially clear synthetic anchors: the official subject PDFs begin their elementary achievement-standard codes at grades 3-4; grades 1-2 arts/movement learning is handled through integrated subjects rather than standalone `[2미]`, `[2음]`, or `[2체]` code families.

## Semantic and Provenance Sample Results

| Subject | Sample | PASS | PARTIAL | FAIL | Assessment |
|---|---:|---:|---:|---:|---|
| 국어 | 25 | 25 | 0 | 0 | Direct concise paraphrases matched Annex 5. |
| 수학 | 25 | 25 | 0 | 0 | Code, grade band, domain, and quoted subtopic locator matched Annex 8 evidence. Summaries are locator statements, not substantive standard paraphrases. |
| 과학 | 25 | 25 | 0 | 0 | Unit labels and paraphrases matched Annex 9 standard lines. |
| 영어 | 15 | 15 | 0 | 0 | Paraphrases matched Annex 14; per-record locator/evidence remains weak. |
| 도덕 | 10 | 10 | 0 | 0 | Relationship-domain labels and paraphrases matched Annex 6. |
| 실과(기술·가정)/정보 | 10 | 10 | 0 | 0 | Paraphrases matched Annex 10. |
| 통합교과 | 15 | 15 | 0 | 0 | The sampled base records also remain present in the amended Annex 15; corpus completeness fails because 건강한 생활 is absent. |
| 사회 | 20 | 0 | 1 | 19 | 12 sampled codes were absent; seven present codes had unrelated official meanings; `[6사02-02]` had only broad population-topic overlap. |
| 미술 | 10 | 0 | 0 | 10 | Four sampled grade-1-2 codes absent; all summaries were generic English/Korean `anchor` placeholders, not standard-level paraphrases. |
| 음악 | 10 | 0 | 0 | 10 | Four sampled grade-1-2 codes absent; all summaries were generic `anchor` placeholders. |
| 체육 | 10 | 0 | 0 | 10 | Five sampled codes absent; present-code domain meanings were also wrong in cases such as `[4체03-01]`. |
| **Total** | **175** | **125** | **1** | **49** |  |

Source-reference result for the same sample:

- `official-source-checked`: **125/125** sampled records include a direct subject-PDF source record.
- `needs-official-code-check`: **0/50** sampled records include a direct social/art/music/PE PDF source record.

Representative semantic failures:

| Dataset record | Dataset claim | Official source evidence | Verdict |
|---|---|---|---|
| `kr-2022-elem-social-studies:[4사02-02]` (`data/kr/curriculum-standards.json:9698`) | 산지, 하천, 평야, 해안의 기본 모습 | Official `[4사02-02]` concerns old objects/documents as evidence about the past and historical reconstruction. | FAIL |
| `kr-2022-elem-social-studies:[4사05-01]` (`data/kr/curriculum-standards.json:10174`) | 학급 규칙과 공동체 약속 | Official `[4사05-01]` concerns types of maps and map elements such as direction, legend, scale, and elevation. | FAIL |
| `kr-2022-elem-social-studies:[6사05-01]` | 헌법과 기본권의 생활 의미 | Official `[6사05-01]` concerns the influence of Confucian culture and changes in Joseon society/life. | FAIL |
| `kr-2022-elem-social-studies:[6사02-02]` | 저출생, 고령화, 인구 이동, 외국인 주민 증가 | Official `[6사02-02]` focuses on population distribution and capital-region concentration. There is broad population overlap, but the specific dataset bundle is not directly supported. | PARTIAL |
| `kr-2022-elem-physical-education:[4체03-01]` (`data/kr/curriculum-standards.json:18063`) | 경쟁 domain anchor | Official `[4체03-01]` is an expression-activity standard about creative/aesthetic movement. | FAIL |
| `kr-2022-elem-art:[2미01-01]` (`data/kr/curriculum-standards.json:16357`) | standalone grade-1-2 art anchor | No `[2미01-01]` in Annex 13; summary is a generic `anchor` sentence. | FAIL |
| `kr-2022-elem-music:[2음02-02]` (`data/kr/curriculum-standards.json:17120`) | standalone grade-1-2 music anchor | No `[2음02-02]` in Annex 12; summary is a generic `anchor` sentence. | FAIL |

## Exact Sample

### 국어 (25)

`kr-2022-elem-korean:[2국01-01]`, `kr-2022-elem-korean:[2국02-01]`, `kr-2022-elem-korean:[2국02-04]`, `kr-2022-elem-korean:[2국03-02]`, `kr-2022-elem-korean:[2국04-02]`, `kr-2022-elem-korean:[2국04-03]`, `kr-2022-elem-korean:[2국05-02]`, `kr-2022-elem-korean:[4국01-02]`, `kr-2022-elem-korean:[4국02-04]`, `kr-2022-elem-korean:[4국03-02]`, `kr-2022-elem-korean:[4국03-04]`, `kr-2022-elem-korean:[4국03-05]`, `kr-2022-elem-korean:[4국04-02]`, `kr-2022-elem-korean:[4국05-01]`, `kr-2022-elem-korean:[4국05-05]`, `kr-2022-elem-korean:[4국06-02]`, `kr-2022-elem-korean:[6국01-04]`, `kr-2022-elem-korean:[6국01-06]`, `kr-2022-elem-korean:[6국02-05]`, `kr-2022-elem-korean:[6국03-03]`, `kr-2022-elem-korean:[6국04-02]`, `kr-2022-elem-korean:[6국04-04]`, `kr-2022-elem-korean:[6국05-03]`, `kr-2022-elem-korean:[6국06-02]`, `kr-2022-elem-korean:[6국06-04]`

### 수학 (25)

`kr-2022-elem-math:[2수01-10]`, `kr-2022-elem-math:[2수03-03]`, `kr-2022-elem-math:[2수03-08]`, `kr-2022-elem-math:[2수03-10]`, `kr-2022-elem-math:[4수01-04]`, `kr-2022-elem-math:[4수01-14]`, `kr-2022-elem-math:[4수02-03]`, `kr-2022-elem-math:[4수03-04]`, `kr-2022-elem-math:[4수03-05]`, `kr-2022-elem-math:[4수03-06]`, `kr-2022-elem-math:[4수03-08]`, `kr-2022-elem-math:[4수03-13]`, `kr-2022-elem-math:[4수03-18]`, `kr-2022-elem-math:[4수03-19]`, `kr-2022-elem-math:[4수03-21]`, `kr-2022-elem-math:[4수03-24]`, `kr-2022-elem-math:[4수04-01]`, `kr-2022-elem-math:[6수01-01]`, `kr-2022-elem-math:[6수01-02]`, `kr-2022-elem-math:[6수01-12]`, `kr-2022-elem-math:[6수02-05]`, `kr-2022-elem-math:[6수03-06]`, `kr-2022-elem-math:[6수03-14]`, `kr-2022-elem-math:[6수03-15]`, `kr-2022-elem-math:[6수04-02]`

### 과학 (25)

`kr-2022-elem-science:[4과01-03]`, `kr-2022-elem-science:[4과03-03]`, `kr-2022-elem-science:[4과04-03]`, `kr-2022-elem-science:[4과09-02]`, `kr-2022-elem-science:[4과10-02]`, `kr-2022-elem-science:[4과10-03]`, `kr-2022-elem-science:[4과11-02]`, `kr-2022-elem-science:[4과12-02]`, `kr-2022-elem-science:[4과12-03]`, `kr-2022-elem-science:[4과14-01]`, `kr-2022-elem-science:[4과14-02]`, `kr-2022-elem-science:[4과15-01]`, `kr-2022-elem-science:[4과16-02]`, `kr-2022-elem-science:[6과02-02]`, `kr-2022-elem-science:[6과02-03]`, `kr-2022-elem-science:[6과04-02]`, `kr-2022-elem-science:[6과04-03]`, `kr-2022-elem-science:[6과05-01]`, `kr-2022-elem-science:[6과05-03]`, `kr-2022-elem-science:[6과08-01]`, `kr-2022-elem-science:[6과09-02]`, `kr-2022-elem-science:[6과12-02]`, `kr-2022-elem-science:[6과13-03]`, `kr-2022-elem-science:[6과14-02]`, `kr-2022-elem-science:[6과15-04]`

### 사회 (20)

`kr-2022-elem-social-studies:[4사01-05]`, `kr-2022-elem-social-studies:[4사01-06]`, `kr-2022-elem-social-studies:[4사02-02]`, `kr-2022-elem-social-studies:[4사02-03]`, `kr-2022-elem-social-studies:[4사02-05]`, `kr-2022-elem-social-studies:[4사04-03]`, `kr-2022-elem-social-studies:[4사05-01]`, `kr-2022-elem-social-studies:[6사01-05]`, `kr-2022-elem-social-studies:[6사02-02]`, `kr-2022-elem-social-studies:[6사02-05]`, `kr-2022-elem-social-studies:[6사03-02]`, `kr-2022-elem-social-studies:[6사04-04]`, `kr-2022-elem-social-studies:[6사04-06]`, `kr-2022-elem-social-studies:[6사05-01]`, `kr-2022-elem-social-studies:[6사05-03]`, `kr-2022-elem-social-studies:[6사05-04]`, `kr-2022-elem-social-studies:[6사06-01]`, `kr-2022-elem-social-studies:[6사06-04]`, `kr-2022-elem-social-studies:[6사06-05]`, `kr-2022-elem-social-studies:[6사06-06]`

### 영어 (15)

`kr-2022-elem-english-efl:[4영01-02]`, `kr-2022-elem-english-efl:[4영01-07]`, `kr-2022-elem-english-efl:[4영01-08]`, `kr-2022-elem-english-efl:[4영01-10]`, `kr-2022-elem-english-efl:[4영02-04]`, `kr-2022-elem-english-efl:[4영02-09]`, `kr-2022-elem-english-efl:[4영02-10]`, `kr-2022-elem-english-efl:[6영01-01]`, `kr-2022-elem-english-efl:[6영01-05]`, `kr-2022-elem-english-efl:[6영01-06]`, `kr-2022-elem-english-efl:[6영01-08]`, `kr-2022-elem-english-efl:[6영02-01]`, `kr-2022-elem-english-efl:[6영02-02]`, `kr-2022-elem-english-efl:[6영02-08]`, `kr-2022-elem-english-efl:[6영02-09]`

### 도덕 (10)

`kr-2022-elem-moral:[4도01-01]`, `kr-2022-elem-moral:[4도01-03]`, `kr-2022-elem-moral:[4도02-01]`, `kr-2022-elem-moral:[4도02-02]`, `kr-2022-elem-moral:[4도02-03]`, `kr-2022-elem-moral:[4도03-02]`, `kr-2022-elem-moral:[4도04-01]`, `kr-2022-elem-moral:[6도02-03]`, `kr-2022-elem-moral:[6도03-02]`, `kr-2022-elem-moral:[6도04-02]`

### 실과(기술·가정)/정보 (10)

`kr-2022-elem-practical-arts:[6실01-02]`, `kr-2022-elem-practical-arts:[6실01-06]`, `kr-2022-elem-practical-arts:[6실02-08]`, `kr-2022-elem-practical-arts:[6실02-11]`, `kr-2022-elem-practical-arts:[6실03-02]`, `kr-2022-elem-practical-arts:[6실03-03]`, `kr-2022-elem-practical-arts:[6실03-04]`, `kr-2022-elem-practical-arts:[6실03-05]`, `kr-2022-elem-practical-arts:[6실04-02]`, `kr-2022-elem-practical-arts:[6실04-04]`

### 통합교과 (15)

`kr-2022-elem-integrated:[2바01-01]`, `kr-2022-elem-integrated:[2바01-03]`, `kr-2022-elem-integrated:[2바02-02]`, `kr-2022-elem-integrated:[2바04-02]`, `kr-2022-elem-integrated:[2바04-03]`, `kr-2022-elem-integrated:[2슬01-02]`, `kr-2022-elem-integrated:[2슬01-04]`, `kr-2022-elem-integrated:[2슬04-01]`, `kr-2022-elem-integrated:[2슬04-04]`, `kr-2022-elem-integrated:[2즐01-03]`, `kr-2022-elem-integrated:[2즐02-02]`, `kr-2022-elem-integrated:[2즐02-03]`, `kr-2022-elem-integrated:[2즐03-02]`, `kr-2022-elem-integrated:[2즐04-02]`, `kr-2022-elem-integrated:[2즐04-03]`

### 미술 (10)

`kr-2022-elem-art:[2미01-01]`, `kr-2022-elem-art:[2미02-03]`, `kr-2022-elem-art:[2미02-04]`, `kr-2022-elem-art:[2미03-02]`, `kr-2022-elem-art:[4미01-02]`, `kr-2022-elem-art:[4미01-03]`, `kr-2022-elem-art:[6미01-01]`, `kr-2022-elem-art:[6미01-03]`, `kr-2022-elem-art:[6미01-04]`, `kr-2022-elem-art:[6미03-03]`

### 음악 (10)

`kr-2022-elem-music:[2음02-02]`, `kr-2022-elem-music:[2음02-04]`, `kr-2022-elem-music:[2음03-01]`, `kr-2022-elem-music:[2음03-03]`, `kr-2022-elem-music:[4음02-03]`, `kr-2022-elem-music:[4음03-01]`, `kr-2022-elem-music:[4음03-02]`, `kr-2022-elem-music:[4음03-03]`, `kr-2022-elem-music:[6음01-03]`, `kr-2022-elem-music:[6음02-01]`

### 체육 (10)

`kr-2022-elem-physical-education:[2체01-03]`, `kr-2022-elem-physical-education:[2체02-02]`, `kr-2022-elem-physical-education:[4체01-01]`, `kr-2022-elem-physical-education:[4체01-03]`, `kr-2022-elem-physical-education:[4체03-01]`, `kr-2022-elem-physical-education:[4체04-02]`, `kr-2022-elem-physical-education:[6체01-01]`, `kr-2022-elem-physical-education:[6체03-01]`, `kr-2022-elem-physical-education:[6체04-01]`, `kr-2022-elem-physical-education:[6체05-01]`

## Every Source Record Inspected

`data/kr/curriculum-standards.json:19-258` contains 21 source records. The table below evaluates each record rather than accepting its label.

| # | Source ID | Target/live result | Standard refs | Audit result |
|---:|---|---|---:|---|
| 1 | `kr-moe` | `https://www.moe.go.kr/`; HTTP 200 JS redirect, browser resolves current MOE homepage | 0 | Reachable contextual publisher page, not record-level evidence. |
| 2 | `kr-moe-2022-33-annex15-pdf` | attachment `10003571`; HTTP 200; 1,152,492 bytes; hash and 54 pages match stored metadata | 48 | PASS for base integrated codes; stale as the only integrated source after the 2026 amendment. |
| 3 | `kr-moe-2022-33-annex5-pdf` | `sourceUrl` attachment `10003553`; HTTP 200; stored SHA-256 matches | 87 | Substantive PASS, metadata FAIL: uses `title`/`sourceUrl`/`retrievedAt` and lacks schema-required `name`/`url`/`usage`. |
| 4 | `kr-ncic` | `https://ncic.re.kr/`; HTTP 200 | 247 | Reachable portal context only. |
| 5 | `kr-ncic-2022-elem-integrated-attachment` | inventory page; HTTP 200 | 48 | Context/attachment tuple support; not direct standard text. |
| 6 | `kr-ncic-2022-elem-korean-attachment` | `sourceUrl` inventory page; HTTP 200 | 87 | Metadata FAIL: same schema field mismatch as source #3. |
| 7 | `kr-ncic-2022-english-pdf` | attachment `10003794`; HTTP 200; 306 pages | 40 | PASS for all 40 code strings; broad non-vendored extraction locators only. |
| 8 | `kr-ncic-2022-notice-543` | stored URL returns HTTP 404 | 0 | FAIL: dead URL and missing schema-required `usage`. |
| 9 | `kr-ncic-2022-notice-list` | notice list; HTTP 200 | 72 | Reachable broad publication context; not social record-level proof. |
| 10 | `kr-ncic-2022-notices` | same notice-list URL; HTTP 200 | 234 | Reachable but duplicates source #9's effective URL and remains broad context. |
| 11 | `kr-ncic-2026-amendment-notice-1864` | stored URL returns HTTP 404 | 0 | FAIL: dead URL, missing `usage`, and insufficient amendment record. Live inventory reveals the integrated amendment it does not capture. |
| 12 | `kr-ncic-copyright` | live policy; HTTP 200 | 0 | Reachable and material to release. Policy conditions are not translated into work-specific license metadata. |
| 13 | `kr-ncic-domestic-inventory` | inventory page; HTTP 200 | 0 | Reachable but missing schema-required `usage`; duplicates the effective URL of sources #5, #6, #14, and #15. |
| 14 | `kr-ncic-inventory` | inventory page; HTTP 200 | 427 | Reachable broad context; does not prove individual codes. |
| 15 | `kr-ncic-inventory-api` | inventory page plus stored POST tuple; live endpoint confirmed | 40 | Useful attachment-metadata context for English, but effective URL duplicates other inventory records. |
| 16 | `kr-ncic-math-pdf-2022` | attachment `10003559`; HTTP 200; 263 pages | 121 | PASS for all 121 codes and sampled locators. |
| 17 | `kr-ncic-moral-pdf-2022` | attachment `10003738`; HTTP 200; 92 pages | 24 | PASS for all 24 codes and sampled summaries. |
| 18 | `kr-ncic-practical-arts-pdf-2022` | attachment `10003781`; HTTP 200; 222 pages | 39 | Substantive PASS, metadata FAIL: has `evidenceUse` but lacks schema-required `usage`. |
| 19 | `kr-ncic-science-pdf-2022` | attachment `10003551`; HTTP 200; 292 pages | 102 | PASS for all 102 codes; stored file size/pages are `null`, so metadata is incomplete. |
| 20 | `kr-project-v03-social-seed` | local `file:data/kr/curriculum-standards.seed.json`; exists, 1,085,745 bytes | 72 | Local candidate provenance only; not an official source. Full comparison proves extensive mismatch. |
| 21 | `kr-repo-mapping-method` | local `docs/kr-curriculum-mapping-method.md`; exists, 5,704 bytes | 0 | Project method/context only; not external claim support. |

Source-record pass/fail counts:

- HTTP(S) targets inspected: **19**; HTTP 200: **17**; HTTP 404: **2**.
- Repository-local targets inspected: **2**; both exist.
- JSON Schema source-record gate (`id`, `name`, `url`, `usage`): **15 PASS / 6 FAIL**.
- Schema-failing source IDs: `kr-moe-2022-33-annex5-pdf`, `kr-ncic-2022-elem-korean-attachment`, `kr-ncic-2022-notice-543`, `kr-ncic-2026-amendment-notice-1864`, `kr-ncic-domestic-inventory`, `kr-ncic-practical-arts-pdf-2022`.
- Zero-standard-ref source IDs: `kr-moe`, `kr-ncic-2022-notice-543`, `kr-ncic-2026-amendment-notice-1864`, `kr-ncic-copyright`, `kr-ncic-domestic-inventory`, `kr-repo-mapping-method`.

The custom validator still passes because it counts source objects and validates only referenced source IDs. It does not execute `schema/kr-curriculum-standards.schema.json:76-86`.

### Important official PDFs absent from the source table

All four were discoverable and downloadable during this audit; lack of access is not the reason they are missing.

| Subject | Official file | URL |
|---|---|---|
| 사회 | `[별책7] 사회과 교육과정.pdf`, attachment `10003800` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003800&orgType=ogi4` |
| 체육 | `[별책11] 체육과 교육과정.pdf`, attachment `10003695` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003695&orgType=ogi4` |
| 음악 | `[별책12] 음악과 교육과정.pdf`, attachment `10003561` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003561&orgType=ogi4` |
| 미술 | `[별책13] 미술과 교육과정.pdf`, attachment `10003555` | `https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003555&orgType=ogi4` |

The current amended Annex 15 attachment `10004214` is also absent.

## Licensing and Provenance Findings

### Repository claims

- `package.json:7` gives the package license as `(ODbL-1.0 AND CC-BY-SA-4.0)`.
- `README.md:103-121` correctly says `curriculum-standards.json` is not Marble's to relicense and each source remains under its upstream license in `PROVENANCE.md`.
- `PROVENANCE.md:12-40` documents UK, CCSS, NGSS, C3, and IB sources, but contains **no Korean/NCIC/MOE section**.
- `data/kr/curriculum-standards.json:12-16` states `licensingStatus: "public-government-documents-with-provenance"`, but that phrase is not a license grant or usage condition.
- `data/kr/workstreams/practical-arts.json:9` says an NCIC notice marks public reuse under KOGL Type 2, but the record does not identify a work-specific KOGL mark or preserve proof of that mark.

### Live NCIC policy

The live page `https://ncic.re.kr/mbr/policy.do` states, in substance:

- works fully owned by KICE may be freely used under Copyright Act Article 24-2;
- freely usable materials are opened with a KOGL mark, described on the page as KOGL Type 2;
- the user must first confirm that the individual work carries the mark;
- KOGL Type 2 prohibits commercial use;
- every type requires source attribution;
- unmarked materials require prior consultation with the rights contact.

All eleven base PDFs and the amended Annex 15 were text-extracted for this audit. The extraction found no `공공누리`, `공공저작물`, `KOGL`, `출처표시`, or `비상업` marker string. That does not prove no visual mark exists, but the repository provides no screenshot, file-level license field, permission record, or other evidence resolving the work-specific condition.

### Release implication

The dataset omits bulk official wording, which reduces risk, and code identifiers themselves are low-copyright-risk factual anchors. However, many `summary` fields explicitly describe themselves as source-derived paraphrases. Without a Korean upstream-license section and work-specific KOGL/permission evidence, the repository cannot safely present the KR layer as covered by the package's commercial-friendly ODbL/CC BY-SA explanation.

This is a provenance/licensing **HOLD**, not a legal opinion. A qualified rights review should determine whether the summaries are independently authored facts, permitted derivatives, or material subject to KOGL/other source conditions, and should add the exact attribution and commercial-use boundary to `PROVENANCE.md`.

## Structural Validator Pass vs Curricular/Content Correctness

### What the current validator proves

- declared counts match array lengths;
- keys and code strings have the expected shape;
- status values belong to a three-value enum;
- `sourceRefs` point to a known source ID;
- topic/mapping/dependency/cluster references resolve;
- manifest byte sizes and checksums match;
- configured global minima are met.

### What the current validator does not prove

- a code exists in an official document;
- a source ID is a direct or authoritative source for that standard;
- source URLs are reachable;
- source records satisfy the JSON Schema;
- a summary matches the meaning of the same official code;
- all current official codes are represented;
- an amendment has been reconciled;
- `official-source-checked` has item-level evidence;
- a source-derived paraphrase may be redistributed under the package license.

Concrete false green:

- `scripts/validate-kr.mjs:18` accepts `[2미01-01]`, `[2음01-01]`, and `[2체01-01]` because they match the regex, although no such codes occur in the corresponding official subject PDFs.
- It accepts the social code families even when the same official code has unrelated meaning.
- It would reject current official `[2건..]` codes because `건` is absent from the regex.
- It passes six source records that violate `schema/kr-curriculum-standards.schema.json:78`.
- It passes with two stored source URLs returning 404.

## Critical Findings by Severity

### Critical

1. **Synthetic and omitted code inventory:** 92 dataset-only base codes and 62 base official-only codes; 71 official-only codes after the current amendment.
2. **Social semantic collision:** official code strings are reused for unrelated locally designed domains and claims.
3. **Current amendment omitted:** nine 건강한 생활 standards missing from a dataset generated after the amendment was available; schema and validator cannot encode them.
4. **KR upstream licensing absent:** no Korean section in `PROVENANCE.md`; work-specific KOGL/permission and attribution evidence missing.

### Important

5. Four governing base PDFs and the current amended Annex 15 are absent as source records.
6. Six of 21 source records violate the source JSON Schema; two stored URLs are dead.
7. All 180 candidate standards cite generic portal/list or local-seed sources rather than direct governing subject PDFs.
8. English's 40 official-status records lack per-record locators/evidence, relying on broad ranges in a non-vendored local extraction copy.
9. The repository's current status fields are partly honest (`integrated-workstream-candidate`, top-level `needs-official-code-check`), but downstream consumers can still mistake 641 structurally valid anchors for official coverage.

### Positive evidence worth preserving

10. All 461 codes marked `official-source-checked` match the cited base PDFs exactly.
11. The 125-record official-status semantic sample passed, and its records all had direct subject-PDF refs.
12. Stored hashes for Annex 5 and base Annex 15 match live bytes; stored page/size metadata for English, math, moral, practical arts, and base integrated subjects matched the downloads where provided.
13. Official text is intentionally not bulk-reproduced.

## Compact Claim Ledger

| Claim | Class | Evidence | Verdict |
|---|---|---|---|
| The KR corpus has 641 standard records: 461 official-status and 180 needs-check. | A | `data/kr/curriculum-standards.json`; full JSON count command; manifest | Supported |
| All 461 official-status code strings occur in their cited base PDFs. | A | Eleven live PDF downloads; full set comparison; per-subject table | Supported |
| 92 dataset codes do not occur in corresponding base PDFs. | A | Full set difference; exact lists above | Supported |
| Social records are semantically mismatched even when a code string exists. | A | Annex 7 contexts for `[4사02-02]`, `[4사05-01]`, `[6사05-01]`; sample ledger | Supported |
| Current amended Annex 15 adds nine 건강한 생활 standards. | A | NCIC 2026 inventory API; attachment `10004214`; extracted code inventory | Supported |
| Current schema/validator cannot represent `[2건..]`. | A | `schema/kr-curriculum-standards.schema.json:143`; `scripts/validate-kr.mjs:18` | Supported |
| Two stored source URLs are dead. | A | Live curl GET probes for source IDs `kr-ncic-2022-notice-543` and `kr-ncic-2026-amendment-notice-1864` | Supported |
| KR commercial/general redistribution terms are established. | F | No KR section in `PROVENANCE.md`; no work-specific KOGL/permission proof | Not Supported / HOLD |

## Required Gates Before Ship

1. Rebuild social studies from official Annex 7's 49 elementary codes and meanings. Do not preserve the local six-by-six code scaffold merely for identifier continuity.
2. Remove standalone grade-1-2 art/music/PE codes; route appropriate foundations through integrated curricula.
3. Rebuild art, music, and PE against Annexes 13, 12, and 11, including all official-only codes and correct domain numbering/meaning.
4. Reconcile the current amended Annex 15 and add the nine 건강한 생활 codes, topics, mappings, clusters, and dependencies.
5. Expand `KR_CODE` and the schema pattern to allow `건`, but only together with the official amended source and tests.
6. Add direct source records for social, art, music, PE, and the amended integrated curriculum, with attachment number, official title, publisher, URL, retrieval date, byte size, SHA-256, pages, and item-level locator policy.
7. Normalize all source records to the schema-required `name`, `url`, and `usage` fields; remove or explicitly relate duplicate inventory/notice aliases.
8. Replace the two dead notice URLs or mark them archived with a verified current equivalent.
9. Add a validator gate that compares reviewed code-inventory snapshots to official attachment hashes and refuses unexplained code differences.
10. Add semantic collision tests for code-to-summary/domain mappings; code existence alone is insufficient.
11. Add actual JSON Schema validation to `npm run validate:kr`.
12. Add a Korean section to `PROVENANCE.md` documenting exact upstream rights, work-specific KOGL/permission evidence, required attribution, and commercial-use boundaries. Do not rely on `public-government-documents-with-provenance` as a license.
13. Preserve a reproducible source extract or page/section locator for every `official-source-checked` record, especially English.
14. Re-run the full code comparison, semantic sample, current-amendment check, schema validation, and URL probes before changing the ship verdict.

## Final Decision

**NO-SHIP.**

The current artifact may remain an explicitly non-canonical internal candidate. It must not be shipped as complete Korean 2022 revised-curriculum coverage, as a current post-amendment curriculum layer, or as a commercially cleared source-derived dataset until the critical gates above are closed.
