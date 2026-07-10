#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { repairWorkstreamContent } from './lib/kr-content-quality.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data', 'kr', 'workstreams', 'integrated.json');

const CURRICULUM_ID = 'kr-2022-elem-integrated';
const SUBJECT = 'Integrated Subjects';
const SUBJECT_KO = '통합교과';
const GRADE_BAND = '1-2';
const AGE_RANGE = { start: 6, end: 8, label: '초등학교 1~2학년' };

const sourceRefs = [
  'kr-moe-2022-33-annex15-pdf',
  'kr-ncic-2022-elem-integrated-attachment'
];

const lifeQuestions = {
  '01': {
    slug: 'who',
    en: 'Who We Live As',
    ko: '우리는 누구로 살아갈까',
    sourceSection: '공통 교육과정 > 바른 생활·슬기로운 생활·즐거운 생활 > 초등학교 1~2학년 > 우리는 누구로 살아갈까'
  },
  '02': {
    slug: 'where',
    en: 'Where We Live',
    ko: '우리는 어디서 살아갈까',
    sourceSection: '공통 교육과정 > 바른 생활·슬기로운 생활·즐거운 생활 > 초등학교 1~2학년 > 우리는 어디서 살아갈까'
  },
  '03': {
    slug: 'now',
    en: 'How We Live Now',
    ko: '우리는 지금 어떻게 살아갈까',
    sourceSection: '공통 교육과정 > 바른 생활·슬기로운 생활·즐거운 생활 > 초등학교 1~2학년 > 우리는 지금 어떻게 살아갈까'
  },
  '04': {
    slug: 'doing',
    en: 'What We Do As We Live',
    ko: '우리는 무엇을 하며 살아갈까',
    sourceSection: '공통 교육과정 > 바른 생활·슬기로운 생활·즐거운 생활 > 초등학교 1~2학년 > 우리는 무엇을 하며 살아갈까'
  }
};

const integratedSubjects = {
  바: {
    slug: 'right-life',
    en: 'Right Life',
    ko: '바른 생활',
    facetTypes: ['CONCEPTUAL', 'PROCEDURAL', 'META'],
    facets: ['생활 맥락 이해', '바른 생활 실천', '성찰과 습관화']
  },
  슬: {
    slug: 'wise-life',
    en: 'Wise Life',
    ko: '슬기로운 생활',
    facetTypes: ['CONCEPTUAL', 'REPRESENTATIONAL', 'PROCEDURAL'],
    facets: ['탐구 질문 만들기', '관찰과 자료 읽기', '탐구 결과 설명']
  },
  즐: {
    slug: 'joyful-life',
    en: 'Joyful Life',
    ko: '즐거운 생활',
    facetTypes: ['CONCEPTUAL', 'PROCEDURAL', 'REPRESENTATIONAL'],
    facets: ['감각과 상상 열기', '놀이와 표현하기', '감상과 나눔']
  }
};

const inventory = [
  ['바', '01', [
    ['[2바01-01]', '안전하고 건강한 학교 생활과 학습 습관 형성'],
    ['[2바01-02]', '자기 이해와 자기 존중을 바탕으로 생활하기'],
    ['[2바01-03]', '가족과 주변 사람을 배려하며 관계 맺기'],
    ['[2바01-04]', '사람과 자연이 함께 사는 생태환경 실천']
  ]],
  ['바', '02', [
    ['[2바02-01]', '공동체 안에서 할 수 있는 일 찾기와 실천'],
    ['[2바02-02]', '우리나라의 소중함과 나라 사랑 마음 기르기'],
    ['[2바02-03]', '차이와 다양성을 존중하는 생활 태도'],
    ['[2바02-04]', '새로운 활동에 대한 호기심과 도전']
  ]],
  ['바', '03', [
    ['[2바03-01]', '하루의 가치를 느끼고 지금을 소중히 여기기'],
    ['[2바03-02]', '계절 변화에 맞추어 생활하기'],
    ['[2바03-03]', '여러 인물의 삶에서 공동체성 배우기'],
    ['[2바03-04]', '지속가능한 삶의 방식을 찾아 실천하기']
  ]],
  ['바', '04', [
    ['[2바04-01]', '모두를 위한 생활환경 만들기에 참여하기'],
    ['[2바04-02]', '다양한 생각과 의견에 열린 태도 형성'],
    ['[2바04-03]', '여럿이 하는 활동에 관심을 갖고 협력하기'],
    ['[2바04-04]', '생활 습관과 학습 습관 되돌아보기']
  ]],
  ['슬', '01', [
    ['[2슬01-01]', '학교 안팎의 모습과 생활 탐색 및 안전한 학교 생활'],
    ['[2슬01-02]', '나를 탐색하고 나에 대해 설명하기'],
    ['[2슬01-03]', '가족과 주변 사람이 함께 살아가는 모습 탐구'],
    ['[2슬01-04]', '사람, 자연, 동식물이 어우러진 생태 탐구']
  ]],
  ['슬', '02', [
    ['[2슬02-01]', '마을과 사람들이 생활하는 모습 살펴보기'],
    ['[2슬02-02]', '우리나라의 모습과 문화 조사하기'],
    ['[2슬02-03]', '알고 싶은 나라를 탐구하며 관심 넓히기'],
    ['[2슬02-04]', '궁금한 세계를 여러 매체로 탐색하기']
  ]],
  ['슬', '03', [
    ['[2슬03-01]', '하루의 변화와 사람들의 하루 생활 탐색'],
    ['[2슬03-02]', '계절과 생활의 관계 탐구'],
    ['[2슬03-03]', '관심 대상의 과거와 현재를 살피고 미래 상상'],
    ['[2슬03-04]', '생활과 관련된 지속가능성 사례 탐색']
  ]],
  ['슬', '04', [
    ['[2슬04-01]', '생활도구의 모양과 기능 탐색 및 바꾸기'],
    ['[2슬04-02]', '상상한 것을 매체와 재료로 구현하기'],
    ['[2슬04-03]', '경험에서 관심 주제를 정하고 조사하기'],
    ['[2슬04-04]', '배운 것과 배울 것을 연결하며 배움 상상']
  ]],
  ['즐', '01', [
    ['[2즐01-01]', '즐겁게 놀이하며 건강하고 안전하게 생활하기'],
    ['[2즐01-02]', '놀이 속 몸 움직임과 감각 느끼기'],
    ['[2즐01-03]', '가족과 주변 사람과 소통하며 어울리기'],
    ['[2즐01-04]', '주변 자연의 아름다움 감상하기']
  ]],
  ['즐', '02', [
    ['[2즐02-01]', '참여할 수 있는 문화 예술 향유'],
    ['[2즐02-02]', '우리나라 문화 예술 즐기기'],
    ['[2즐02-03]', '다른 나라 문화 예술 체험'],
    ['[2즐02-04]', '다양한 세상을 상상하고 표현하기']
  ]],
  ['즐', '03', [
    ['[2즐03-01]', '하루를 건강하고 활기차게 지내기'],
    ['[2즐03-02]', '자연의 변화를 느끼며 놀이하기'],
    ['[2즐03-03]', '전통문화를 새롭게 표현하기'],
    ['[2즐03-04]', '안전과 안녕을 위한 아동 권리 알고 누리기']
  ]],
  ['즐', '04', [
    ['[2즐04-01]', '주변 물건을 활용한 놀잇감 만들기'],
    ['[2즐04-02]', '자유롭게 상상하며 놀이하기'],
    ['[2즐04-03]', '생각과 느낌을 살린 전시나 공연 활동'],
    ['[2즐04-04]', '기억에 남는 경험에 의미 부여하기']
  ]]
];

function codeParts(code) {
  const match = code.match(/^\[2([바슬즐])(\d{2})-(\d{2})\]$/);
  if (!match) throw new Error(`Bad integrated standard code ${code}`);
  return { subjectCode: match[1], areaCode: match[2], number: match[3] };
}

function cleanCode(code) {
  const { subjectCode, areaCode, number } = codeParts(code);
  const subjectToken = { 바: 'ba', 슬: 'seul', 즐: 'jeul' }[subjectCode];
  return `2${subjectToken}${areaCode}${number}`;
}

function standardKey(code) {
  return `${CURRICULUM_ID}:${code}`;
}

function topicId(standard, facetIndex) {
  return `kr.mt.integrated.${standard.domainSlug}.${standard.lifeQuestionSlug}.${cleanCode(standard.code)}.${String(facetIndex + 1).padStart(2, '0')}`;
}

function topicDescription(standard, facet) {
  const subject = integratedSubjects[standard.integratedSubjectCode];
  return `${AGE_RANGE.label} 학습자가 ${standard.summary}을/를 ${subject.ko}의 ${standard.lifeQuestionKorean} 맥락에서 ${facet} 단위로 다룰 수 있게 하는 세부 주제이다.`;
}

function evidenceFor(standard, facetIndex) {
  const subject = integratedSubjects[standard.integratedSubjectCode];
  if (standard.integratedSubjectCode === '바') {
    return [
      `${standard.summary}이 필요한 생활 장면을 학교, 가정, 마을 중 한 곳에서 찾고 설명한다.`,
      `${standard.lifeQuestionKorean} 질문과 연결해 자신이 실천할 수 있는 행동을 한 가지 정해 실행한다.`,
      `${subject.ko} 활동 뒤에 잘된 점과 다음에 고칠 점을 말, 그림, 짧은 글 중 하나로 기록한다.`
    ];
  }
  if (standard.integratedSubjectCode === '슬') {
    return [
      `${standard.summary}에 대해 관찰하거나 조사할 질문을 만든다.`,
      `그림, 사진, 표, 이야기, 현장 관찰 중 알맞은 자료로 ${standard.lifeQuestionKorean} 맥락의 단서를 모은다.`,
      `탐구한 내용을 자신의 말로 설명하고 새로 궁금해진 점을 한 가지 제시한다.`
    ];
  }
  return [
    `${standard.summary}과 관련된 움직임, 소리, 이미지, 만들기 요소를 탐색한다.`,
    `친구와 안전하게 놀이하거나 표현 활동에 참여하고 자신의 역할을 수행한다.`,
    `활동 뒤에 느낀 점, 새롭게 표현한 점, 함께 나눈 점을 말이나 작품으로 보여 준다.`
  ];
}

function assessmentPromptFor(standard, facet) {
  const subject = integratedSubjects[standard.integratedSubjectCode];
  if (standard.integratedSubjectCode === '바') {
    return `학습자가 ${standard.summary}과 관련된 생활 장면을 알아차리고, ${standard.lifeQuestionKorean} 맥락에서 실천한 뒤 자신의 습관 변화를 설명할 수 있는가?`;
  }
  if (standard.integratedSubjectCode === '슬') {
    return `학습자가 ${standard.summary}에 대한 질문을 세우고 자료를 살핀 뒤, ${standard.lifeQuestionKorean} 맥락의 탐구 결과를 근거와 함께 설명할 수 있는가?`;
  }
  return `학습자가 ${standard.summary}을/를 ${subject.ko}의 ${facet} 활동으로 즐기며 표현하고, 안전한 참여와 감상 나눔을 보여 줄 수 있는가?`;
}

const standards = [];
for (const [integratedSubjectCode, areaCode, rows] of inventory) {
  const subject = integratedSubjects[integratedSubjectCode];
  const lifeQuestion = lifeQuestions[areaCode];
  for (const [code, summary] of rows) {
    const parts = codeParts(code);
    if (parts.subjectCode !== integratedSubjectCode || parts.areaCode !== areaCode) {
      throw new Error(`Inventory mismatch for ${code}`);
    }
    standards.push({
      key: standardKey(code),
      code,
      gradeBand: GRADE_BAND,
      subject: SUBJECT,
      subjectKorean: SUBJECT_KO,
      domain: subject.en,
      domainKorean: subject.ko,
      domainSlug: subject.slug,
      integratedSubjectCode,
      lifeQuestion: lifeQuestion.en,
      lifeQuestionKorean: lifeQuestion.ko,
      lifeQuestionSlug: lifeQuestion.slug,
      summary,
      officialTextIncluded: false,
      sourceRefs,
      sourceSection: lifeQuestion.sourceSection,
      verificationStatus: 'official-source-checked',
      sourceBasis: 'Achievement-standard code inventory checked against NCIC-hosted Ministry of Education 2022-33 Annex 15 PDF; this artifact stores concise source-derived paraphrases rather than official standard text.',
      evidence: [
        `NCIC inventory tuple checked: degreeCode=1014, classCode=1002, subjectCode=3363, openYear=2022, openMonth=12.`,
        `Official attachment checked: [별책15] 바른 생활, 슬기로운 생활, 즐거운 생활 교육과정.pdf, orgAttNo=10003571.`,
        `Code ${code} appears in the ${subject.ko} achievement-standard section for ${AGE_RANGE.label}.`
      ]
    });
  }
}

const microTopics = [];
const standardMappings = [];
const standardTopicMap = new Map();

for (const standard of standards) {
  const subject = integratedSubjects[standard.integratedSubjectCode];
  const topicIds = [];
  subject.facets.forEach((facet, i) => {
    const id = topicId(standard, i);
    const name = `${standard.summary} - ${facet}`;
    topicIds.push(id);
    microTopics.push({
      id,
      type: subject.facetTypes[i],
      subject: SUBJECT,
      subjectKorean: SUBJECT_KO,
      domain: subject.en,
      domainKorean: subject.ko,
      gradeBand: GRADE_BAND,
      ageRangeStart: AGE_RANGE.start,
      ageRangeEnd: AGE_RANGE.end,
      lifeQuestion: standard.lifeQuestion,
      lifeQuestionKorean: standard.lifeQuestionKorean,
      name,
      title: name,
      titleKorean: name,
      titleEnglish: `${subject.en} ${standard.lifeQuestion} ${standard.code} micro-topic ${i + 1}`,
      description: topicDescription(standard, facet),
      evidence: evidenceFor(standard, i),
      assessmentPrompt: assessmentPromptFor(standard, facet),
      standards: [standard.key],
      sourceStandardCode: standard.code,
      verificationStatus: 'public-doc-derived',
      generationBasis: `${standard.code} ${subject.ko} 성취기준을 ${standard.lifeQuestionKorean} 영역의 ${facet} 세부 주제로 분해했다.`
    });
    standardMappings.push({
      standardKey: standard.key,
      microTopicId: id,
      relationship: i === 0 ? 'introduces' : i === 1 ? 'supports' : 'assesses',
      confidence: 'official-source-derived',
      note: `${standard.code} ${subject.ko} 성취기준을 ${facet} 세부 주제로 연결한다.`
    });
  });
  standardTopicMap.set(standard.code, topicIds);
}

for (const standard of standards) {
  delete standard.domainSlug;
  delete standard.integratedSubjectCode;
  delete standard.lifeQuestionSlug;
}

const dependencySuggestions = [];
const edgeKeys = new Set();
function addEdge(topicIdValue, prerequisiteId, strength, reason) {
  const key = `${topicIdValue}->${prerequisiteId}`;
  if (topicIdValue === prerequisiteId || edgeKeys.has(key)) return;
  edgeKeys.add(key);
  dependencySuggestions.push({
    topicId: topicIdValue,
    prerequisiteId,
    strength,
    status: 'suggested-for-review',
    reason
  });
}

for (const [integratedSubjectCode, areaCode, rows] of inventory) {
  const subject = integratedSubjects[integratedSubjectCode];
  const lifeQuestion = lifeQuestions[areaCode];
  for (const [code] of rows) {
    const ids = standardTopicMap.get(code);
    addEdge(ids[1], ids[0], 'hard', `${code} ${subject.ko} 수행 주제는 먼저 ${lifeQuestion.ko} 맥락의 핵심 조건 이해가 필요하다.`);
    addEdge(ids[2], ids[1], 'soft', `${code} ${subject.ko} 성찰·나눔 주제는 실제 활동 수행 뒤에 점검하는 흐름이 자연스럽다.`);
  }
  for (let i = 1; i < rows.length; i += 1) {
    const previous = standardTopicMap.get(rows[i - 1][0]);
    const current = standardTopicMap.get(rows[i][0]);
    addEdge(current[0], previous[2], 'soft', `${subject.ko} ${lifeQuestion.ko} 영역 안의 순차 학습 제안이다.`);
  }
}

const subjectOrder = ['바', '슬', '즐'];
for (const areaCode of Object.keys(lifeQuestions)) {
  for (let i = 0; i < 4; i += 1) {
    const codesBySubject = subjectOrder.map((subjectCode) => inventory.find(([s, a]) => s === subjectCode && a === areaCode)[2][i][0]);
    addEdge(standardTopicMap.get(codesBySubject[1])[0], standardTopicMap.get(codesBySubject[0])[2], 'soft', `${lifeQuestions[areaCode].ko} 통합 흐름에서 바른 생활 실천 경험이 슬기로운 생활 탐구 질문을 뒷받침한다.`);
    addEdge(standardTopicMap.get(codesBySubject[2])[0], standardTopicMap.get(codesBySubject[1])[2], 'soft', `${lifeQuestions[areaCode].ko} 통합 흐름에서 슬기로운 생활 탐구 결과가 즐거운 생활 놀이·표현으로 확장된다.`);
  }
}

for (const subjectCode of subjectOrder) {
  const subject = integratedSubjects[subjectCode];
  const subjectRows = inventory.filter(([s]) => s === subjectCode);
  for (let i = 1; i < subjectRows.length; i += 1) {
    const previousLastCode = subjectRows[i - 1][2].at(-1)[0];
    const currentFirstCode = subjectRows[i][2][0][0];
    addEdge(
      standardTopicMap.get(currentFirstCode)[0],
      standardTopicMap.get(previousLastCode)[2],
      'soft',
      `${subject.ko}의 이전 삶 질문에서 형성한 경험이 다음 삶 질문의 첫 주제를 준비한다.`
    );
  }
}

const clusters = [];
for (const [integratedSubjectCode, areaCode, rows] of inventory) {
  const subject = integratedSubjects[integratedSubjectCode];
  const lifeQuestion = lifeQuestions[areaCode];
  const topicIds = rows.flatMap(([code]) => standardTopicMap.get(code));
  clusters.push({
    id: `kr.cluster.integrated.${subject.slug}.${lifeQuestion.slug}.${GRADE_BAND}`,
    name: `${subject.ko} - ${lifeQuestion.ko}`,
    title: `${subject.ko} - ${lifeQuestion.ko}`,
    titleKorean: `${subject.ko} - ${lifeQuestion.ko}`,
    titleEnglish: `${subject.en} - ${lifeQuestion.en}`,
    subject: SUBJECT,
    subjectKorean: SUBJECT_KO,
    domain: subject.en,
    domainKorean: subject.ko,
    gradeBand: GRADE_BAND,
    lifeQuestion: lifeQuestion.en,
    lifeQuestionKorean: lifeQuestion.ko,
    topicCount: topicIds.length,
    topics: topicIds,
    summary: `${AGE_RANGE.label} ${subject.ko} ${lifeQuestion.ko} 영역의 공식 성취기준 ${rows.length}개를 ${topicIds.length}개 세부 주제로 분해한 클러스터이다.`
  });
}

const coverageGaps = [
  {
    id: 'gap.kr.integrated.official-text-omitted',
    severity: 'intentional',
    note: 'Official achievement-standard wording is not embedded verbatim; this artifact stores codes, source-derived paraphrases, and NCIC/MOE source metadata.'
  },
  {
    id: 'gap.kr.integrated.hwp-crosscheck',
    severity: 'review-needed',
    note: 'The PDF attachment was downloaded and checked. The paired HWP attachment orgAttNo=10003572 should be retained as a secondary format for human review.'
  },
  {
    id: 'gap.kr.integrated.2026-amendment-reconciliation',
    severity: 'review-needed',
    note: 'NCIC lists a 2026.01 elementary curriculum branch. Integration should decide whether Annex 15 has a successor amendment requiring a later artifact.'
  },
  {
    id: 'gap.kr.integrated.dependency-expert-review',
    severity: 'review-needed',
    note: 'Dependency suggestions encode plausible first-school-life, inquiry, and expression flow, but have not been reviewed by an integrated-curriculum specialist.'
  },
  {
    id: 'gap.kr.integrated.classroom-assessment-calibration',
    severity: 'review-needed',
    note: 'Evidence statements and assessment prompts are source-aligned generated checks and should be calibrated with grade 1-2 classroom examples before product use.'
  }
];

const artifact = {
  dataset: 'Korean Marble Taxonomy integrated-subjects workstream',
  taxonomyVersion: 'kr-full-depth-v0.3-workstream-integrated',
  generatedAt: '2026-07-09T00:00:00+09:00',
  locale: 'ko-KR',
  country: 'KR',
  subject: SUBJECT,
  subjectKorean: SUBJECT_KO,
  curriculumId: CURRICULUM_ID,
  status: 'subject-workstream-artifact',
  verificationStatus: 'official-source-checked',
  sourceBasis: 'Official NCIC inventory API located the 2022.12 elementary integrated-subjects attachment; codes were checked against the Ministry of Education 2022-33 Annex 15 PDF downloaded from NCIC.',
  textPolicy: {
    officialStandardTextIncluded: false,
    summaryPolicy: 'Concise source-derived paraphrases only; no bulk verbatim curriculum text is included.',
    licensingStatus: 'Public Korean national curriculum source metadata plus local generated workstream design.',
    licenseCaution: 'Before final integration, keep official curriculum text in external source references and preserve attribution to NCIC/MOE.'
  },
  sources: [
    {
      id: 'kr-ncic',
      name: 'NCIC 국가교육과정정보센터',
      url: 'https://ncic.re.kr/',
      accessDate: '2026-07-09',
      usage: 'Official public national curriculum portal reference.'
    },
    {
      id: 'kr-ncic-2022-elem-integrated-attachment',
      name: 'NCIC 2022 elementary integrated-subjects inventory row',
      url: 'https://ncic.re.kr/inv/org/list.do',
      accessDate: '2026-07-09',
      usage: 'Official inventory path and attachment metadata for 2022.12 elementary 바른 생활, 슬기로운 생활, 즐거운 생활.',
      inventoryPath: '2022 개정 시기 > 초등학교(2022.12) > 바른 생활, 슬기로운 생활, 즐거운 생활',
      apiIdentifiers: {
        degreeCode: '1014',
        classCode: '1002',
        subjectCode: '3363',
        openYear: '2022',
        openMonth: '12'
      }
    },
    {
      id: 'kr-moe-2022-33-annex15-pdf',
      name: '교육부 고시 제2022-33호 [별책 15] 바른 생활, 슬기로운 생활, 즐거운 생활 교육과정',
      publisher: '교육부',
      via: 'NCIC 국가교육과정정보센터',
      url: 'https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003571&orgType=ogi4',
      accessDate: '2026-07-09',
      usage: 'Governing source for official achievement-standard code inventory and integrated-subjects framing.',
      attachmentName: '[별책15] 바른 생활, 슬기로운 생활, 즐거운 생활 교육과정.pdf',
      attachmentNo: '10003571',
      pairedHwpAttachmentNo: '10003572',
      sha256: '5fe191f258d11cc77741c57cfb16324b26d5db14649809cc694dcbcd4662adee',
      fileSizeBytes: 1152492,
      pdfPages: 54
    }
  ],
  domains: Object.entries(integratedSubjects).map(([code, subject]) => ({
    code,
    slug: subject.slug,
    domain: subject.en,
    domainKorean: subject.ko
  })),
  lifeQuestions: Object.entries(lifeQuestions).map(([code, question]) => ({
    code,
    slug: question.slug,
    lifeQuestion: question.en,
    lifeQuestionKorean: question.ko
  })),
  counts: {},
  sourceCount: 0,
  standardCount: 0,
  microTopicCount: 0,
  mappingCount: 0,
  dependencySuggestionCount: 0,
  clusterCount: 0,
  coverageGapCount: 0,
  standards,
  microTopics,
  standardMappings,
  dependencySuggestions,
  clusters,
  coverageGaps
};

artifact.sourceCount = artifact.sources.length;
artifact.standardCount = artifact.standards.length;
artifact.microTopicCount = artifact.microTopics.length;
artifact.mappingCount = artifact.standardMappings.length;
artifact.dependencySuggestionCount = artifact.dependencySuggestions.length;
artifact.clusterCount = artifact.clusters.length;
artifact.coverageGapCount = artifact.coverageGaps.length;
artifact.counts = {
  sources: artifact.sourceCount,
  standards: artifact.standardCount,
  microTopics: artifact.microTopicCount,
  standardMappings: artifact.mappingCount,
  dependencySuggestions: artifact.dependencySuggestionCount,
  clusters: artifact.clusterCount,
  coverageGaps: artifact.coverageGapCount
};

const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const expectedCodes = inventory.flatMap(([, , rows]) => rows.map(([code]) => code));
const standardKeys = new Set(artifact.standards.map((standard) => standard.key));
const topicIds = new Set(artifact.microTopics.map((topic) => topic.id));
check(artifact.standardCount === 48, `expected 48 official integrated standards, got ${artifact.standardCount}`);
check(artifact.microTopicCount === artifact.standardCount * 3, 'micro-topic count must be 3 per standard');
check(standardKeys.size === artifact.standardCount, 'duplicate standard keys');
check(topicIds.size === artifact.microTopicCount, 'duplicate topic ids');
for (const code of expectedCodes) {
  check(standardKeys.has(standardKey(code)), `missing official standard code ${code}`);
}
for (const standard of artifact.standards) {
  check(/^\[2(바|슬|즐)(01|02|03|04)-0[1-4]\]$/.test(standard.code), `bad integrated standard code ${standard.code}`);
  check(standard.verificationStatus === 'official-source-checked', `bad standard verification ${standard.code}`);
  check(Array.isArray(standard.evidence) && standard.evidence.length >= 3, `standard evidence too short ${standard.code}`);
}
for (const topic of artifact.microTopics) {
  check(topic.id.startsWith('kr.mt.integrated.'), `bad topic id ${topic.id}`);
  check(topic.evidence.length >= 3, `topic evidence too short ${topic.id}`);
  check(typeof topic.assessmentPrompt === 'string' && topic.assessmentPrompt.length > 20, `topic assessmentPrompt missing ${topic.id}`);
  for (const key of topic.standards) check(standardKeys.has(key), `topic ${topic.id} unknown standard ${key}`);
}
for (const mapping of artifact.standardMappings) {
  check(standardKeys.has(mapping.standardKey), `mapping unknown standard ${mapping.standardKey}`);
  check(topicIds.has(mapping.microTopicId), `mapping unknown topic ${mapping.microTopicId}`);
}
for (const dep of artifact.dependencySuggestions) {
  check(topicIds.has(dep.topicId), `dependency unknown topic ${dep.topicId}`);
  check(topicIds.has(dep.prerequisiteId), `dependency unknown prerequisite ${dep.prerequisiteId}`);
  check(dep.topicId !== dep.prerequisiteId, `self dependency ${dep.topicId}`);
}
for (const cluster of artifact.clusters) {
  check(cluster.topicCount === cluster.topics.length, `cluster count mismatch ${cluster.id}`);
  for (const id of cluster.topics) check(topicIds.has(id), `cluster unknown topic ${id}`);
}
check(artifact.counts.sources === artifact.sources.length, 'source count mismatch');
check(artifact.counts.standards === artifact.standards.length, 'standard count mismatch');
check(artifact.counts.microTopics === artifact.microTopics.length, 'micro-topic count mismatch');
check(artifact.counts.standardMappings === artifact.standardMappings.length, 'mapping count mismatch');
check(artifact.counts.dependencySuggestions === artifact.dependencySuggestions.length, 'dependency count mismatch');
check(artifact.counts.clusters === artifact.clusters.length, 'cluster count mismatch');
check(artifact.counts.coverageGaps === artifact.coverageGaps.length, 'coverage gap count mismatch');

if (errors.length) {
  console.error(`Integrated workstream validation failed with ${errors.length} problem(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(repairWorkstreamContent(artifact), null, 2)}\n`);
console.log(`Wrote ${OUT}`);
console.log(`Counts: ${artifact.standardCount} standards, ${artifact.microTopicCount} microTopics, ${artifact.mappingCount} mappings, ${artifact.dependencySuggestionCount} dependencies, ${artifact.clusterCount} clusters, ${artifact.coverageGapCount} gaps.`);
