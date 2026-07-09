# Korean Curriculum Mapping Method

## Scope

This method governs staged mapping from Korea's 2022 revised elementary curriculum into Korean Marble Taxonomy records. The public curriculum documents are the governing source; the seed records provenance and verification status so staged work is honest about what has and has not been checked.

## General Record Rules

Each standard anchor should include:

- `key`: `<curriculum-id>:<achievement-standard-code>`.
- `code`: Korean achievement-standard code such as `[2국02-01]` or `[4영01-01]`.
- `gradeBand`: `1-2`, `3-4`, or `5-6`.
- `subject` / `subjectKorean`.
- `domain` / `domainKorean`.
- `summary`: concise original summary or source-derived paraphrase.
- `sourceRefs`: official public source references.
- `verificationStatus`: `official-source-checked`, `public-doc-derived`, or `needs-official-code-check`.
- `sourceBasis`: one-sentence explanation of how the anchor was derived.

Use `needs-official-code-check` when the subject/domain shape is reliable but exact code verification is pending.

## Subject-specific Rules

### 국어

Do not treat Korean Language as English Language Arts translated into Korean. Model:

- Hangul decoding, syllable blocks, sound-letter correspondence.
- Korean vocabulary, sentence awareness, and grammar.
- Listening/speaking discourse routines in Korean classrooms.
- Reading fluency and meaning-making in Korean texts.
- Writing for Korean audiences and genres.
- Literature response and media literacy.

### 영어 / EFL

Elementary English is an EFL curriculum for Korean learners. Do not use native-speaker ELA assumptions. Model:

- Oral exposure before heavy print production.
- English sound recognition under Korean phonological transfer constraints.
- Classroom greetings, formulaic chunks, and simple interaction.
- Alphabet/phonics as foreign-language literacy.
- Listening and speaking confidence before extended reading/writing.
- Grade 5–6 information exchange, short reading, and short writing.

### 수학

Use Korean 2022 elementary sequencing and domains. Anchors should reflect:

- 수와 연산.
- 변화와 관계.
- 도형과 측정.
- 자료와 가능성.
- Grade-band progression from concrete representation to symbolic/general reasoning.

### 과학

Use Korean elementary science as inquiry plus domains. Anchors should reflect:

- Observation, classification, measurement, communication, and model use.
- 운동과 에너지.
- 물질.
- 생명.
- 지구와 우주.
- Investigation evidence rather than vocabulary memorization alone.

### 사회 / 역사 / 지리 / 시민성

Do not reuse US/UK history as the default. Korean social studies should begin from:

- Local community, maps, places, and regions of Korea.
- Changes in local life and Korean historical time.
- Korean geography and regional diversity.
- Democratic participation, public institutions, rights and responsibilities.
- Korean culture, economy, and civic life.

### 도덕

Model moral education around:

- Self-understanding and moral agency.
- Empathy, relationships, and respectful communication.
- Fairness, responsibility, community life.
- Peace, ecological responsibility, and coexistence.

### 실과 / 정보

Model practical arts as Korean elementary life-and-technology learning:

- Self-care, growth, family and household participation.
- Resource use and practical problem solving.
- Making, technology, and tool use.
- Digital/information problem solving at the elementary level.

### 통합교과

Model grades 1–2 integrated subjects as first-school-life anchors:

- 바른 생활: habits, routines, safe participation.
- 슬기로운 생활: inquiry into self, school, community, seasons.
- 즐거운 생활: expression, play, cooperation, arts-integrated experience.

## Mapping Rules

`standardMappings` connect achievement-standard anchors to micro-topics:

- `standardKey` must resolve to a standard.
- `microTopicId` must resolve to a micro-topic.
- `relationship` should be one of `introduces`, `supports`, `extends`, `assesses`.
- `confidence` should remain `seed` until a reviewer checks the mapping.
- `note` should explain why the mapping exists.

## Expansion Workflow

1. Source official curriculum PDF/NCIC record.
2. Extract subject/domain/grade-band/code inventory.
3. Create or update standards with provenance and verification status.
4. Decompose each standard into teachable micro-topics.
5. Review Korean subject fit; reject imported English/US/UK assumptions.
6. Run `npm run validate:kr` and update `data/kr/manifest.json`.
7. Run `npm run validate` to protect the upstream dataset path.
