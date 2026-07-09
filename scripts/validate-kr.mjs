#!/usr/bin/env node
/**
 * validate-kr.mjs - dependency-free integrity check for the Korean staged seed.
 *
 * Enforces the operational invariants for the Korea redesign seed: declared
 * counts, source/provenance presence, Korean 2022 code-key consistency,
 * verification-status honesty, referential integrity, and manifest checksums.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KR_DATA = resolve(ROOT, 'data', 'kr');
const load = (name) => JSON.parse(readFileSync(resolve(KR_DATA, name), 'utf8'));
const bytesOf = (name) => readFileSync(resolve(KR_DATA, name));

const errors = [];
const check = (cond, msg) => { if (!cond) errors.push(msg); };

const seed = load('curriculum-standards.seed.json');
const manifest = load('manifest.json');

const SUBJECTS = new Map([
  ['kr-2022-elem-korean', { subject: 'Korean Language', ko: '국어', code: '국' }],
  ['kr-2022-elem-math', { subject: 'Mathematics', ko: '수학', code: '수' }],
  ['kr-2022-elem-science', { subject: 'Science', ko: '과학', code: '과' }],
  ['kr-2022-elem-social-studies', { subject: 'Social Studies', ko: '사회', code: '사' }],
  ['kr-2022-elem-english-efl', { subject: 'English as a Foreign Language', ko: '영어', code: '영' }],
  ['kr-2022-elem-moral', { subject: 'Moral Education', ko: '도덕', code: '도' }],
  ['kr-2022-elem-practical-arts', { subject: 'Practical Arts', ko: '실과', code: '실' }],
  ['kr-2022-elem-integrated', { subject: 'Integrated Subjects', ko: '통합교과', code: '(바|슬|즐)' }],
]);
const SUBJECT_NAMES = new Set([...SUBJECTS.values()].map((s) => s.subject));
const SUBJECT_KO = new Set([...SUBJECTS.values()].map((s) => s.ko));
const TOPIC_TYPES = new Set(['CONCEPTUAL', 'PROCEDURAL', 'REPRESENTATIONAL', 'LANGUAGE', 'META']);
const RELATIONSHIPS = new Set(['introduces', 'supports', 'extends', 'assesses']);
const CONFIDENCE = new Set(['seed', 'reviewed', 'verified']);
const VERIFICATION = new Set(['official-source-checked', 'public-doc-derived', 'needs-official-code-check']);

check(seed.locale === 'ko-KR', `locale must be ko-KR, got ${seed.locale}`);
check(seed.country === 'KR', `country must be KR, got ${seed.country}`);
check(seed.status === 'seed' || seed.status === 'staged-seed', `status must be seed/staged-seed, got ${seed.status}`);
check(VERIFICATION.has(seed.verificationStatus), `top-level verificationStatus is invalid: ${seed.verificationStatus}`);
check(typeof seed.sourceBasis === 'string' && seed.sourceBasis.length > 0, 'top-level sourceBasis is required');
check(seed.textPolicy?.standardTextIncluded === false, 'textPolicy.standardTextIncluded must be false for staged seed');
check(seed.sourceCount === seed.sources?.length, `sourceCount ${seed.sourceCount} != ${seed.sources?.length}`);
check(seed.curriculumCount === seed.curricula?.length, `curriculumCount ${seed.curriculumCount} != ${seed.curricula?.length}`);
check(seed.microTopicCount === seed.microTopics?.length, `microTopicCount ${seed.microTopicCount} != ${seed.microTopics?.length}`);
check(seed.mappingCount === seed.standardMappings?.length, `mappingCount ${seed.mappingCount} != ${seed.standardMappings?.length}`);
check(seed.coverageNoteCount === seed.coverageNotes?.length, `coverageNoteCount ${seed.coverageNoteCount} != ${seed.coverageNotes?.length}`);

const sourceIds = new Set();
for (const source of seed.sources ?? []) {
  check(typeof source.id === 'string' && source.id.startsWith('kr-'), `source id malformed: ${source.id}`);
  check(typeof source.url === 'string' && source.url.startsWith('https://'), `source ${source.id}: url must be https`);
  check(typeof source.accessDate === 'string' && source.accessDate.length > 0, `source ${source.id}: missing accessDate`);
  check(typeof source.usage === 'string' && source.usage.length > 0, `source ${source.id}: missing usage`);
  if (sourceIds.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
  sourceIds.add(source.id);
}

let actualStandardCount = 0;
const standardKeys = new Set();
for (const curriculum of seed.curricula ?? []) {
  const spec = SUBJECTS.get(curriculum.id);
  check(Boolean(spec), `unexpected curriculum id: ${curriculum.id}`);
  if (!spec) continue;
  check(curriculum.slug === curriculum.id, `curriculum ${curriculum.id}: slug must match id`);
  check(curriculum.country === 'KR', `curriculum ${curriculum.id}: country must be KR`);
  check(curriculum.subject === spec.subject, `curriculum ${curriculum.id}: subject mismatch`);
  check(curriculum.subjectKorean === spec.ko, `curriculum ${curriculum.id}: Korean subject mismatch`);
  check(curriculum.textIncluded === false, `curriculum ${curriculum.id}: textIncluded must be false`);
  check(curriculum.standardCount === curriculum.standards?.length, `curriculum ${curriculum.id}: standardCount != standards length`);
  check(Array.isArray(curriculum.sourceUrls) && curriculum.sourceUrls.length > 0, `curriculum ${curriculum.id}: missing sourceUrls`);

  const codeRe = new RegExp(`^\\[[246]${spec.code}[0-9]{2}-[0-9]{2}\\]$`);
  for (const standard of curriculum.standards ?? []) {
    actualStandardCount++;
    const expectedKey = `${curriculum.id}:${standard.code}`;
    check(standard.key === expectedKey, `standard key mismatch: ${standard.key} != ${expectedKey}`);
    check(codeRe.test(standard.code), `standard ${standard.key}: bad or mismatched KR code ${standard.code}`);
    check(standard.sourceTextIncluded === false, `standard ${standard.key}: sourceTextIncluded must be false in staged seed`);
    check(standard.subject === spec.subject, `standard ${standard.key}: subject mismatch`);
    check(standard.subjectKorean === spec.ko, `standard ${standard.key}: Korean subject mismatch`);
    check(VERIFICATION.has(standard.verificationStatus), `standard ${standard.key}: invalid verificationStatus ${standard.verificationStatus}`);
    check(typeof standard.sourceBasis === 'string' && standard.sourceBasis.length > 0, `standard ${standard.key}: missing sourceBasis`);
    check(Array.isArray(standard.sourceRefs) && standard.sourceRefs.length > 0, `standard ${standard.key}: missing sourceRefs`);
    for (const sourceRef of standard.sourceRefs ?? []) {
      check(sourceIds.has(sourceRef), `standard ${standard.key}: unknown sourceRef ${sourceRef}`);
    }
    if (standardKeys.has(standard.key)) errors.push(`duplicate standard key: ${standard.key}`);
    standardKeys.add(standard.key);
  }
}
check(seed.standardCount === actualStandardCount, `standardCount ${seed.standardCount} != ${actualStandardCount}`);

const microTopicIds = new Set();
for (const topic of seed.microTopics ?? []) {
  check(typeof topic.id === 'string' && topic.id.startsWith('kr.mt.'), `microTopic id malformed: ${topic.id}`);
  check(SUBJECT_NAMES.has(topic.subject), `microTopic ${topic.id}: bad subject ${topic.subject}`);
  check(SUBJECT_KO.has(topic.subjectKorean), `microTopic ${topic.id}: bad Korean subject ${topic.subjectKorean}`);
  check(TOPIC_TYPES.has(topic.type), `microTopic ${topic.id}: bad type ${topic.type}`);
  check(typeof topic.titleKorean === 'string' && topic.titleKorean.length > 0, `microTopic ${topic.id}: missing titleKorean`);
  check(typeof topic.titleEnglish === 'string' && topic.titleEnglish.length > 0, `microTopic ${topic.id}: missing titleEnglish`);
  check(typeof topic.summary === 'string' && topic.summary.length > 0, `microTopic ${topic.id}: missing summary`);
  if (microTopicIds.has(topic.id)) errors.push(`duplicate microTopic id: ${topic.id}`);
  microTopicIds.add(topic.id);
}

const mappingPairs = new Set();
for (const mapping of seed.standardMappings ?? []) {
  check(standardKeys.has(mapping.standardKey), `mapping references unknown standard ${mapping.standardKey}`);
  check(microTopicIds.has(mapping.microTopicId), `mapping references unknown microTopic ${mapping.microTopicId}`);
  check(RELATIONSHIPS.has(mapping.relationship), `mapping ${mapping.standardKey}: bad relationship ${mapping.relationship}`);
  check(CONFIDENCE.has(mapping.confidence), `mapping ${mapping.standardKey}: bad confidence ${mapping.confidence}`);
  check(typeof mapping.note === 'string' && mapping.note.length > 0, `mapping ${mapping.standardKey}: missing note`);
  const pair = `${mapping.standardKey} -> ${mapping.microTopicId}`;
  if (mappingPairs.has(pair)) errors.push(`duplicate mapping pair: ${pair}`);
  mappingPairs.add(pair);
}

for (const note of seed.coverageNotes ?? []) {
  check(SUBJECT_NAMES.has(note.subject), `coverage note: bad subject ${note.subject}`);
  check(SUBJECT_KO.has(note.subjectKorean), `coverage note: bad Korean subject ${note.subjectKorean}`);
  check(Array.isArray(note.included) && note.included.length > 0, `coverage note ${note.subject}: missing included`);
  check(Array.isArray(note.gaps) && note.gaps.length > 0, `coverage note ${note.subject}: missing gaps`);
}

for (const [name, meta] of Object.entries(manifest.files ?? {})) {
  const bytes = bytesOf(name);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  check(bytes.length === meta.bytes, `manifest bytes mismatch for ${name}: ${meta.bytes} != ${bytes.length}`);
  check(actualHash === meta.sha256, `manifest checksum mismatch for ${name}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} KR seed problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `✓ KR seed valid - ${seed.curricula.length} curricula, ${standardKeys.size} standards, ` +
    `${microTopicIds.size} micro-topics, ${seed.standardMappings.length} mappings. ` +
    `Provenance, verification status, referential integrity, and checksums OK.`,
);
