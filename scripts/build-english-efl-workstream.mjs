#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repairWorkstreamContent } from './lib/kr-content-quality.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'data', 'kr', 'workstreams', 'english-efl.json');

const subject = 'English as a Foreign Language';
const subjectKorean = '영어';
const curriculumId = 'kr-2022-elem-english-efl';
const sourceRefs = ['kr-ncic-2022-english-pdf', 'kr-ncic-inventory-api'];

const sources = [
  {
    id: 'kr-ncic-inventory-api',
    name: 'NCIC 2022 revised curriculum inventory and attachment metadata',
    url: 'https://ncic.re.kr/inv/org/list.do',
    accessDate: '2026-07-09',
    usage: 'Official public inventory used to verify 2022 elementary English subjectCode 3360 and attachment metadata for [별책14] 영어과 교육과정.pdf.',
    evidence: {
      endpoint: 'POST https://ncic.re.kr/api/inv/invFileList.do',
      parameters: {
        orgType: 'ogi4',
        degreeCode: '1014',
        classCode: '1002',
        openYear: '2022',
        openMonth: '12',
        subjectCode: '3360',
        type: 'dwn'
      },
      pdfAttachmentNo: '10003794',
      hwpAttachmentNo: '10003795'
    }
  },
  {
    id: 'kr-ncic-2022-english-pdf',
    name: '교육부 고시 제2022-33호 [별책 14] 영어과 교육과정',
    url: 'https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003794&orgType=ogi4',
    accessDate: '2026-07-09',
    usage: 'Governing official source for elementary English achievement-standard codes and Korean EFL framing.',
    evidence: {
      fileName: '[별책14] 영어과 교육과정.pdf',
      pages: 306,
      pdfCreationDate: '2022-12-19',
      ncicUploadDate: '2023-10-12 13:54:25',
      elementaryCodeBlocks: [
        'PDF extracted pages 14-25: [초등학교 3∼4학년] and [초등학교 5∼6학년] achievement standards',
        'Text extraction lines 379-388, 462-471, 564-573, 645-654 in local verification copy'
      ]
    }
  },
  {
    id: 'kr-repo-mapping-method',
    name: 'Repository Korean curriculum mapping method',
    url: 'docs/kr-curriculum-mapping-method.md',
    accessDate: '2026-07-09',
    usage: 'Local project rules for KR EFL, provenance, micro-topic decomposition, evidence, assessment prompts, and dependency graph staging.'
  }
];

const standards = [
  ['[4영01-01]', '3-4', 'Understanding', '이해', ['Listening', 'Vocabulary & Expressions'], '알파벳과 쉬운 단어의 소리를 듣고 구별하는 초입 듣기 표준', ['알파벳 소리와 글자 이름 듣기 식별', '한국어 음운 전이를 고려한 기초 단어 소리 구별', '그림 단서로 들은 기초 어휘 확인']],
  ['[4영01-02]', '3-4', 'Understanding', '이해', ['Reading', 'Alphabet & Phonics'], '알파벳 대소문자를 식별하여 읽는 초기 문자 인식 표준', ['대문자와 소문자 모양 식별', '알파벳 이름 읽기와 순서 감각', '교실 자료에서 알파벳 찾기']],
  ['[4영01-03]', '3-4', 'Understanding', '이해', ['Listening', 'Pronunciation'], '쉬운 단어ㆍ어구ㆍ문장에서 강세, 리듬, 억양을 듣고 알아차리는 표준', ['단어 강세 듣기', '짧은 어구 리듬 따라 듣기', '문장 억양 의미 구별']],
  ['[4영01-04]', '3-4', 'Understanding', '이해', ['Reading', 'Alphabet & Phonics'], '소리와 철자의 관계를 바탕으로 쉬운 단어ㆍ어구ㆍ문장을 소리 내어 읽는 표준', ['기초 음철 대응 읽기', '쉬운 단어 블렌딩 읽기', '짧은 어구와 문장 소리내어 읽기']],
  ['[4영01-05]', '3-4', 'Understanding', '이해', ['Listening', 'Reading', 'Vocabulary & Expressions'], '쉬운 단어ㆍ어구ㆍ문장의 의미를 이해하는 기초 의미 파악 표준', ['기초 어휘 의미 연결', '교실 표현 의미 이해', '쉬운 문장 의미 확인']],
  ['[4영01-06]', '3-4', 'Understanding', '이해', ['Listening', 'Reading'], '자기 주변 주제의 담화에서 주요 정보를 파악하는 표준', ['자기소개 담화 주요 정보 듣기', '가족ㆍ친구 주제 정보 찾기', '학교생활 담화 핵심 파악']],
  ['[4영01-07]', '3-4', 'Understanding', '이해', ['Listening', 'Reading', 'Strategies'], '담화나 문장을 듣거나 읽을 때 단서를 활용하는 기초 이해 전략 표준', ['시각 단서로 예측하기', '반복 듣기와 다시 읽기', '몸짓ㆍ그림ㆍ상황 단서 활용']],
  ['[4영01-08]', '3-4', 'Understanding', '이해', ['Listening', 'Reading', 'Media'], '다양한 매체의 쉬운 담화나 문장을 흥미를 가지고 듣거나 읽는 표준', ['그림책ㆍ영상 듣기 읽기', '디지털 카드 문장 이해', '매체 자료에 흥미 표현']],
  ['[4영01-09]', '3-4', 'Understanding', '이해', ['Listening', 'Culture & Intercultural'], '시, 노래, 이야기를 공감하며 듣는 정서ㆍ문학 감상 표준', ['영어 노래 듣고 분위기 느끼기', '짧은 이야기 장면 이해', '시와 챈트에 감정 반응하기']],
  ['[4영01-10]', '3-4', 'Understanding', '이해', ['Listening', 'Reading', 'Culture & Intercultural'], '자기 주변 주제나 문화 자료를 존중의 태도로 듣거나 읽는 표준', ['문화 소재 그림ㆍ문장 이해', '다른 생활 방식 존중하기', '주변 문화 표현 듣고 읽기']],
  ['[4영02-01]', '3-4', 'Expression', '표현', ['Speaking', 'Pronunciation'], '쉬운 단어ㆍ어구ㆍ문장을 강세, 리듬, 억양에 맞게 따라 말하는 표준', ['교사 모델 따라 말하기', '챈트 리듬으로 어구 말하기', '짧은 문장 억양 재현']],
  ['[4영02-02]', '3-4', 'Expression', '표현', ['Writing', 'Alphabet & Phonics'], '알파벳 대소문자를 구별하여 쓰는 초기 쓰기 표준', ['대소문자 모양 따라 쓰기', '획순과 위치 맞춰 쓰기', '알파벳 카드 보고 쓰기']],
  ['[4영02-03]', '3-4', 'Expression', '표현', ['Writing', 'Alphabet & Phonics'], '소리와 철자의 관계를 바탕으로 쉬운 단어를 쓰는 표준', ['소리 듣고 첫 글자 쓰기', '쉬운 단어 보고 쓰기', '철자 점검하며 다시 쓰기']],
  ['[4영02-04]', '3-4', 'Expression', '표현', ['Speaking', 'Writing'], '실물ㆍ그림ㆍ동작을 보고 쉬운 문장으로 말하거나 단어ㆍ어구를 쓰는 표준', ['실물 보고 한 문장 말하기', '그림 단어 라벨 쓰기', '동작 보고 표현 연결']],
  ['[4영02-05]', '3-4', 'Expression', '표현', ['Speaking', 'Writing', 'Vocabulary & Expressions'], '자신과 주변 사람ㆍ사물을 쉬운 문장으로 소개하거나 묘사하는 표준', ['이름ㆍ나이ㆍ좋아하는 것 말하기', '가족ㆍ친구 간단히 소개', '사물 색ㆍ크기 묘사']],
  ['[4영02-06]', '3-4', 'Expression', '표현', ['Speaking', 'Writing'], '행동 지시를 쉬운 문장으로 말하거나 보고 쓰는 표준', ['교실 행동 지시 말하기', '동작 카드 보고 명령문 쓰기', '순서 있는 행동 표현']],
  ['[4영02-07]', '3-4', 'Expression', '표현', ['Speaking', 'Writing'], '자신의 감정을 쉬운 문장으로 말하거나 보고 쓰는 표준', ['기분 단어 말하기', '감정 그림 보고 문장 만들기', '짧은 감정 카드 쓰기']],
  ['[4영02-08]', '3-4', 'Expression', '표현', ['Speaking', 'Interaction'], '자기 주변 주제 담화의 주요 정보를 묻거나 답하는 표준', ['개인 정보 묻고 답하기', '학교생활 정보 질문하기', '짝 대화에서 핵심 답하기']],
  ['[4영02-09]', '3-4', 'Expression', '표현', ['Speaking', 'Writing', 'Media'], '매체나 전략을 활용하여 창의적으로 의미를 표현하는 표준', ['그림 카드로 의미 표현', '디지털 스티커와 단어 조합', '비언어 전략으로 의사 전달']],
  ['[4영02-10]', '3-4', 'Expression', '표현', ['Speaking', 'Interaction', 'Culture & Intercultural'], '의사소통 활동에 흥미와 자신감을 가지고 예절을 지키며 참여하는 표준', ['인사와 차례 지키기', '실수해도 다시 말하기', '짝 활동에서 예의 있게 반응']],
  ['[6영01-01]', '5-6', 'Understanding', '이해', ['Listening', 'Pronunciation'], '간단한 단어ㆍ어구ㆍ문장에서 강세, 리듬, 억양을 식별하는 심화 듣기 표준', ['강세 변화 듣기', '어구 리듬 패턴 구별', '의문문ㆍ평서문 억양 구별']],
  ['[6영01-02]', '5-6', 'Understanding', '이해', ['Reading', 'Pronunciation'], '간단한 단어ㆍ어구ㆍ문장을 강세, 리듬, 억양에 맞게 소리 내어 읽는 표준', ['어구 단위 소리내어 읽기', '문장 리듬 살려 읽기', '의미 단위로 끊어 읽기']],
  ['[6영01-03]', '5-6', 'Understanding', '이해', ['Listening', 'Reading', 'Vocabulary & Expressions'], '간단한 단어ㆍ어구ㆍ문장의 의미를 이해하는 표준', ['확장 어휘 의미 파악', '일상 표현 의미 이해', '문장 속 단서로 뜻 확인']],
  ['[6영01-04]', '5-6', 'Understanding', '이해', ['Listening', 'Reading'], '일상생활 주제 담화나 글의 세부 정보를 파악하는 표준', ['시간ㆍ장소 세부 정보 찾기', '인물ㆍ사물 정보 확인', '표와 그림에서 정보 대조']],
  ['[6영01-05]', '5-6', 'Understanding', '이해', ['Listening', 'Reading'], '일상생활 주제 담화나 글의 중심 내용을 파악하는 표준', ['짧은 대화 요지 파악', '간단한 글 중심 생각 찾기', '제목과 그림으로 주제 추론']],
  ['[6영01-06]', '5-6', 'Understanding', '이해', ['Listening', 'Reading'], '일상생활 주제 담화나 글에서 일이나 사건의 순서를 파악하는 표준', ['사건 순서 듣기', '절차 글 순서 배열', '전후 관계 단서 찾기']],
  ['[6영01-07]', '5-6', 'Understanding', '이해', ['Listening', 'Reading', 'Strategies'], '일상생활 주제의 담화나 글을 이해하기 위해 전략을 활용하는 표준', ['듣기 전 예측하기', '특정 정보 찾아 듣기 읽기', '내용 확인하며 다시 듣기 읽기']],
  ['[6영01-08]', '5-6', 'Understanding', '이해', ['Listening', 'Reading', 'Media'], '다양한 매체의 담화나 글을 흥미와 자신감을 가지고 듣거나 읽는 표준', ['영상ㆍ앱 자료 핵심 이해', '디지털 텍스트 읽기', '매체 선택 이유 말하기']],
  ['[6영01-09]', '5-6', 'Understanding', '이해', ['Listening', 'Reading', 'Culture & Intercultural'], '시, 노래, 이야기를 공감하며 듣거나 읽는 표준', ['이야기 인물 감정 이해', '노래 가사 분위기 파악', '짧은 문학 텍스트 감상']],
  ['[6영01-10]', '5-6', 'Understanding', '이해', ['Listening', 'Reading', 'Culture & Intercultural'], '일상생활 주제나 문화 자료를 포용의 태도로 듣거나 읽는 표준', ['문화 비교 표현 이해', '다양한 관점 수용하기', '일상 문화 자료 읽고 반응']],
  ['[6영02-01]', '5-6', 'Expression', '표현', ['Speaking', 'Pronunciation'], '간단한 단어ㆍ어구ㆍ문장을 강세, 리듬, 억양에 맞게 말하는 표준', ['강세 살려 문장 말하기', '리듬 있는 짧은 발표', '억양으로 의도 표현']],
  ['[6영02-02]', '5-6', 'Expression', '표현', ['Speaking', 'Writing'], '실물ㆍ그림ㆍ동작을 보고 간단한 단어ㆍ어구ㆍ문장으로 말하거나 쓰는 표준', ['그림 정보 문장화', '실물 관찰 표현 쓰기', '동작과 표현 연결 발표']],
  ['[6영02-03]', '5-6', 'Expression', '표현', ['Writing', 'Alphabet & Phonics'], '알파벳 대소문자와 문장 부호를 문장에서 바르게 사용하는 표준', ['문장 첫 글자 대문자 쓰기', '마침표ㆍ물음표 사용', '문장 부호 점검']],
  ['[6영02-04]', '5-6', 'Expression', '표현', ['Speaking', 'Writing', 'Vocabulary & Expressions'], '주변 사람이나 사물을 간단한 문장으로 소개하거나 묘사하는 표준', ['친구 소개 문장 말하기', '사물 특징 묘사 쓰기', '비교 표현으로 설명']],
  ['[6영02-05]', '5-6', 'Expression', '표현', ['Speaking', 'Writing'], '주변 장소ㆍ위치ㆍ행동 순서ㆍ방법을 간단한 문장으로 설명하는 표준', ['위치 표현으로 길 안내', '행동 순서 말하기', '방법 설명문 쓰기']],
  ['[6영02-06]', '5-6', 'Expression', '표현', ['Speaking', 'Writing'], '감정ㆍ의견ㆍ경험ㆍ계획을 간단한 문장으로 표현하는 표준', ['감정과 이유 말하기', '경험 한두 문장 쓰기', '미래 계획 표현']],
  ['[6영02-07]', '5-6', 'Expression', '표현', ['Speaking', 'Interaction', 'Writing'], '일상생활 주제 담화나 글의 세부 정보를 간단한 문장으로 묻거나 답하는 표준', ['세부 정보 질문 만들기', '들은 내용 답하기', '읽은 정보로 짝 대화']],
  ['[6영02-08]', '5-6', 'Expression', '표현', ['Writing'], '예시문을 참고하여 목적에 맞는 간단한 글을 쓰는 표준', ['초대ㆍ감사 카드 쓰기', '짧은 이메일 형식 쓰기', '경험 글 초안과 수정']],
  ['[6영02-09]', '5-6', 'Expression', '표현', ['Speaking', 'Writing', 'Media'], '매체와 전략을 활용하여 창의적으로 의미를 생성하고 표현하는 표준', ['사진 자료로 말하기', '디지털 도구로 짧은 글 구성', '전략 선택해 의사 전달']],
  ['[6영02-10]', '5-6', 'Expression', '표현', ['Speaking', 'Interaction', 'Culture & Intercultural'], '의사소통 활동에 흥미와 자신감을 가지고 협력적으로 참여하는 표준', ['모둠 대화 역할 수행', '온라인ㆍ오프라인 협력 과업', '상호 피드백으로 다시 표현']]
].map(([code, gradeBand, officialArea, officialAreaKorean, domainTags, summary, focuses]) => {
  const key = `${curriculumId}:${code}`;
  return {
    key,
    code,
    gradeBand,
    subject,
    subjectKorean,
    officialArea,
    officialAreaKorean,
    domainTags,
    summary,
    sourceTextIncluded: false,
    sourceRefs,
    verificationStatus: 'official-source-checked',
    sourceBasis: 'Code and grade-band placement verified against the official NCIC [별책14] English curriculum PDF; summary is a source-derived paraphrase, not copied standard text.',
    sourceEvidence: [
      `Official elementary ${gradeBand} ${officialAreaKorean} block in 교육부 고시 제2022-33호 [별책14].`,
      `NCIC attachment [별책14] 영어과 교육과정.pdf, subjectCode 3360, attachmentNo 10003794.`
    ],
    focuses
  };
});

const typeCycle = ['LANGUAGE', 'PROCEDURAL', 'META'];
const relationshipCycle = ['introduces', 'supports', 'assesses'];

const slugify = (text) => text
  .toLowerCase()
  .replace(/[·ㆍ]/g, '-')
  .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
  .replace(/^-|-$/g, '');

const standardSlug = (code) => code.replace(/[\[\]]/g, '').toLowerCase();
const areaByCode = (code) => code.includes('01-') ? 'understanding' : 'expression';

const microTopics = [];
const standardMappings = [];

for (const standard of standards) {
  standard.focuses.forEach((focus, index) => {
    const domain = standard.domainTags[Math.min(index, standard.domainTags.length - 1)];
    const id = `kr.mt.english-efl.${standard.gradeBand}.${areaByCode(standard.code)}.${standardSlug(standard.code)}.${String(index + 1).padStart(2, '0')}.${slugify(focus)}`;
    const topic = {
      id,
      name: focus,
      title: focus,
      description: `${standard.gradeBand} 학년군 한국어 화자 EFL 학습자가 ${standard.summary}에 도달하도록 ${focus}을/를 분리해 연습하는 세부 주제입니다.`,
      evidence: [
        `Mapped to verified official achievement standard ${standard.code} in the NCIC [별책14] English curriculum PDF.`,
        `Pedagogical strand ${domain} is derived from the official ${standard.officialAreaKorean} area plus the standard focus; this is EFL decomposition, not native ELA import.`
      ],
      assessmentPrompt: `${focus}을/를 확인할 수 있는 짧은 듣기·말하기·읽기·쓰기 과업을 제시하고, 학생이 한국어 도움 없이 의미를 이해하거나 표현했는지 관찰 기록으로 판정한다.`,
      type: typeCycle[index],
      subject,
      subjectKorean,
      domain,
      officialArea: standard.officialArea,
      officialAreaKorean: standard.officialAreaKorean,
      gradeBand: standard.gradeBand,
      standards: [standard.key],
      verificationStatus: 'official-source-checked',
      sourceRefs
    };
    microTopics.push(topic);
    standardMappings.push({
      standardKey: standard.key,
      microTopicId: id,
      relationship: relationshipCycle[index],
      confidence: 'official-code-checked',
      note: `${standard.code}의 공식 성취기준을 ${domain} 세부 주제로 분해한 매핑입니다.`
    });
  });
}

const topicByStandard = new Map();
for (const topic of microTopics) {
  const standardKey = topic.standards[0];
  if (!topicByStandard.has(standardKey)) topicByStandard.set(standardKey, []);
  topicByStandard.get(standardKey).push(topic);
}

const dependencySuggestions = [];
const addDep = (topicId, prerequisiteId, strength, reason) => {
  if (topicId !== prerequisiteId) {
    dependencySuggestions.push({ topicId, prerequisiteId, strength, reason });
  }
};

for (const standard of standards) {
  const topics = topicByStandard.get(standard.key);
  addDep(topics[1].id, topics[0].id, 'hard', '같은 성취기준 안에서 인식 주제가 절차 연습보다 먼저 필요합니다.');
  addDep(topics[2].id, topics[1].id, 'soft', '평가·전이 주제는 절차 연습 뒤에 배치하는 것이 자연스럽습니다.');
}

for (const group of ['3-4:Understanding', '3-4:Expression', '5-6:Understanding', '5-6:Expression']) {
  const [gradeBand, officialArea] = group.split(':');
  const groupStandards = standards.filter((s) => s.gradeBand === gradeBand && s.officialArea === officialArea);
  for (let i = 1; i < groupStandards.length; i += 1) {
    const prevTopics = topicByStandard.get(groupStandards[i - 1].key);
    const nextTopics = topicByStandard.get(groupStandards[i].key);
    addDep(nextTopics[0].id, prevTopics[2].id, 'soft', `${gradeBand} ${officialArea} 영역 안의 공식 코드 순서를 반영한 약한 진행 관계입니다.`);
  }
}

const parallelGradeBridges = [
  ['[6영01-01]', '[4영01-03]'], ['[6영01-02]', '[4영01-04]'], ['[6영01-03]', '[4영01-05]'],
  ['[6영01-04]', '[4영01-06]'], ['[6영01-05]', '[4영01-06]'], ['[6영01-06]', '[4영01-07]'],
  ['[6영01-07]', '[4영01-07]'], ['[6영01-08]', '[4영01-08]'], ['[6영01-09]', '[4영01-09]'],
  ['[6영01-10]', '[4영01-10]'], ['[6영02-01]', '[4영02-01]'], ['[6영02-02]', '[4영02-04]'],
  ['[6영02-03]', '[4영02-02]'], ['[6영02-04]', '[4영02-05]'], ['[6영02-05]', '[4영02-06]'],
  ['[6영02-06]', '[4영02-07]'], ['[6영02-07]', '[4영02-08]'], ['[6영02-08]', '[4영02-03]'],
  ['[6영02-09]', '[4영02-09]'], ['[6영02-10]', '[4영02-10]']
];

const standardByCode = new Map(standards.map((s) => [s.code, s]));
for (const [advanced, prerequisite] of parallelGradeBridges) {
  const advancedTopics = topicByStandard.get(standardByCode.get(advanced).key);
  const prerequisiteTopics = topicByStandard.get(standardByCode.get(prerequisite).key);
  addDep(advancedTopics[0].id, prerequisiteTopics[2].id, 'soft', `5-6학년 ${advanced}는 3-4학년 ${prerequisite}의 기초 경험을 확장합니다.`);
}

const crossSkillBridges = [
  ['[4영02-02]', '[4영01-02]'], ['[4영02-03]', '[4영01-04]'], ['[4영02-08]', '[4영01-06]'],
  ['[4영02-09]', '[4영01-08]'], ['[4영02-10]', '[4영01-10]'], ['[6영02-01]', '[6영01-02]'],
  ['[6영02-03]', '[6영01-02]'], ['[6영02-07]', '[6영01-04]'], ['[6영02-09]', '[6영01-08]'],
  ['[6영02-10]', '[6영01-10]']
];

for (const [expressive, receptive] of crossSkillBridges) {
  const expressiveTopics = topicByStandard.get(standardByCode.get(expressive).key);
  const receptiveTopics = topicByStandard.get(standardByCode.get(receptive).key);
  addDep(expressiveTopics[1].id, receptiveTopics[1].id, 'soft', `${expressive} 표현 과업은 ${receptive} 이해 경험과 연계하면 안정적입니다.`);
}

const clusterDomains = [
  ['Listening', '듣기'],
  ['Speaking', '말하기'],
  ['Reading', '읽기'],
  ['Writing', '쓰기'],
  ['Vocabulary & Expressions', '어휘·표현'],
  ['Culture & Intercultural', '문화·상호문화']
];

const domainAliases = {
  Listening: ['Listening', 'Pronunciation'],
  Speaking: ['Speaking', 'Interaction', 'Pronunciation'],
  Reading: ['Reading', 'Alphabet & Phonics'],
  Writing: ['Writing', 'Alphabet & Phonics'],
  'Vocabulary & Expressions': ['Vocabulary & Expressions'],
  'Culture & Intercultural': ['Culture & Intercultural']
};

function topicMatchesCluster(topic, domain) {
  if (domainAliases[domain].includes(topic.domain)) return true;
  if (topic.domain === 'Strategies') {
    return domain === (topic.officialArea === 'Understanding' ? 'Listening' : 'Speaking');
  }
  if (topic.domain === 'Media') {
    return domain === (topic.officialArea === 'Understanding' ? 'Reading' : 'Writing');
  }
  return false;
}

const clusters = [];
for (const gradeBand of ['3-4', '5-6']) {
  for (const [domain, domainKorean] of clusterDomains) {
    const topics = microTopics
      .filter((topic) => topic.gradeBand === gradeBand && topicMatchesCluster(topic, domain))
      .map((topic) => topic.id);
    clusters.push({
      id: `kr.cluster.english-efl.${gradeBand}.${slugify(domain)}`,
      subject,
      subjectKorean,
      domain,
      domainKorean,
      gradeBand,
      topicCount: topics.length,
      topics,
      summary: `${gradeBand} 학년군 ${domainKorean} 관련 English EFL micro-topic cluster. Official standards remain organized as 이해/표현, so this cluster is a pedagogical strand view.`
    });
  }
}

const coverageGaps = [
  {
    id: 'gap-english-domain-remap',
    status: 'documented',
    note: 'The 2022 English curriculum organizes elementary standards into 이해 and 표현. Listening, speaking, reading, writing, vocabulary, and culture are pedagogical decomposition tags, not one-to-one official domains.'
  },
  {
    id: 'gap-standard-text-policy',
    status: 'documented',
    note: 'Official standard text is not embedded in this artifact; summaries are paraphrases and sourceEvidence points back to NCIC [별책14].'
  },
  {
    id: 'gap-language-forms',
    status: 'needs-follow-up',
    note: 'The [별표 4] elementary recommended language forms should be separately mapped to vocabulary/expression micro-topics before integration.'
  },
  {
    id: 'gap-assessment-calibration',
    status: 'needs-review',
    note: 'Assessment prompts are EFL classroom-ready drafts and need teacher review for grade-level load and Korean classroom timing.'
  },
  {
    id: 'gap-dependency-review',
    status: 'needs-review',
    note: 'Dependency suggestions encode conservative code-order, grade-progression, and receptive-to-expressive links; expert review is still required before hard graph merge.'
  },
  {
    id: 'gap-media-edtech-examples',
    status: 'needs-follow-up',
    note: 'Media and digital-tool micro-topics should later be aligned with allowed classroom tools and privacy constraints.'
  },
  {
    id: 'gap-culture-localization',
    status: 'needs-review',
    note: 'Culture topics intentionally avoid US/UK defaults; local Korean classroom examples still need a reviewed example bank.'
  }
];

const artifact = {
  $schema: 'https://withmarble.com/taxonomy/schema/kr-english-efl-workstream.schema.json',
  dataset: 'Korean Marble Taxonomy English EFL workstream',
  taxonomyVersion: 'kr-full-depth-v0.3-workstream',
  locale: 'ko-KR',
  country: 'KR',
  subject,
  subjectKorean,
  curriculumId,
  status: 'subject-workstream',
  verificationStatus: 'official-source-checked',
  createdAt: '2026-07-09',
  sourceBasis: 'Official NCIC [별책14] English curriculum PDF was downloaded and checked for elementary achievement-standard code inventory. Micro-topics are source-derived EFL decompositions for Korean elementary learners.',
  textPolicy: {
    standardTextIncluded: false,
    topicTextPolicy: 'Topic titles, summaries, evidence, and assessment prompts are newly authored source-derived paraphrases.',
    licensingStatus: 'Official curriculum source cited through NCIC; do not bulk-copy official standard text into merged data without project license review.',
    licenseCaution: 'Keep sourceRefs and evidence locators when integrating.'
  },
  counts: {
    sources: sources.length,
    standards: standards.length,
    microTopics: microTopics.length,
    standardMappings: standardMappings.length,
    dependencySuggestions: dependencySuggestions.length,
    clusters: clusters.length,
    coverageGaps: coverageGaps.length
  },
  sources,
  standards: standards.map(({ focuses, ...standard }) => standard),
  microTopics,
  standardMappings,
  dependencySuggestions,
  clusters,
  coverageGaps
};

mkdirSync(resolve(ROOT, 'data', 'kr', 'workstreams'), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(repairWorkstreamContent(artifact), null, 2)}\n`);
console.log(`Wrote ${OUT}`);
console.log(JSON.stringify(artifact.counts, null, 2));
