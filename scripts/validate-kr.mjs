#!/usr/bin/env node
/**
 * validate-kr.mjs - dependency-free integrity check for the Korean v0.1 seed.
 *
 * This does not run a full JSON Schema validator. It enforces the operational
 * invariants needed for the seed: declared counts, codes-only posture, stable
 * keys, referential integrity, and manifest checksums.
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
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

const seed = load('curriculum-standards.seed.json');
const manifest = load('manifest.json');

const KR_CODE = /^\[[246](수|과|국)[0-9]{2}-[0-9]{2}\]$/;
const CURRICULA = new Set(['kr-2022-elem-math', 'kr-2022-elem-science', 'kr-2022-elem-korean']);
const SUBJECTS = new Set(['Mathematics', 'Science', 'Korean Language']);
const KOREAN_SUBJECTS = new Set(['수학', '과학', '국어']);
const TOPIC_TYPES = new Set(['CONCEPTUAL', 'PROCEDURAL', 'REPRESENTATIONAL', 'LANGUAGE', 'META']);
const RELATIONSHIPS = new Set(['introduces', 'supports', 'extends', 'assesses']);
const CONFIDENCE = new Set(['seed', 'reviewed', 'verified']);

check(seed.locale === 'ko-KR', `locale must be ko-KR, got ${seed.locale}`);
check(seed.country === 'KR', `country must be KR, got ${seed.country}`);
check(seed.status === 'seed', `status must be seed, got ${seed.status}`);
check(seed.textPolicy?.standardTextIncluded === false, 'textPolicy.standardTextIncluded must be false');
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
  if (sourceIds.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
  sourceIds.add(source.id);
}

let actualStandardCount = 0;
const standardKeys = new Set();
for (const curriculum of seed.curricula ?? []) {
  check(CURRICULA.has(curriculum.id), `unexpected curriculum id: ${curriculum.id}`);
  check(curriculum.slug === curriculum.id, `curriculum ${curriculum.id}: slug must match id`);
  check(curriculum.country === 'KR', `curriculum ${curriculum.id}: country must be KR`);
  check(SUBJECTS.has(curriculum.subject), `curriculum ${curriculum.id}: bad subject ${curriculum.subject}`);
  check(KOREAN_SUBJECTS.has(curriculum.subjectKorean), `curriculum ${curriculum.id}: bad Korean subject ${curriculum.subjectKorean}`);
  check(curriculum.textIncluded === false, `curriculum ${curriculum.id}: textIncluded must be false`);
  check(curriculum.standardCount === curriculum.standards?.length, `curriculum ${curriculum.id}: standardCount != standards length`);

  for (const standard of curriculum.standards ?? []) {
    actualStandardCount++;
    const expectedKey = `${curriculum.id}:${standard.code}`;
    check(standard.key === expectedKey, `standard key mismatch: ${standard.key} != ${expectedKey}`);
    check(KR_CODE.test(standard.code), `standard ${standard.key}: bad KR code ${standard.code}`);
    check(standard.sourceTextIncluded === false, `standard ${standard.key}: sourceTextIncluded must be false`);
    check(standard.subject === curriculum.subject, `standard ${standard.key}: subject mismatch`);
    check(standard.subjectKorean === curriculum.subjectKorean, `standard ${standard.key}: Korean subject mismatch`);
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
  check(SUBJECTS.has(topic.subject), `microTopic ${topic.id}: bad subject ${topic.subject}`);
  check(KOREAN_SUBJECTS.has(topic.subjectKorean), `microTopic ${topic.id}: bad Korean subject ${topic.subjectKorean}`);
  check(TOPIC_TYPES.has(topic.type), `microTopic ${topic.id}: bad type ${topic.type}`);
  check(typeof topic.titleKorean === 'string' && topic.titleKorean.length > 0, `microTopic ${topic.id}: missing titleKorean`);
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
  const pair = `${mapping.standardKey} -> ${mapping.microTopicId}`;
  if (mappingPairs.has(pair)) errors.push(`duplicate mapping pair: ${pair}`);
  mappingPairs.add(pair);
}

for (const note of seed.coverageNotes ?? []) {
  check(SUBJECTS.has(note.subject), `coverage note: bad subject ${note.subject}`);
  check(KOREAN_SUBJECTS.has(note.subjectKorean), `coverage note: bad Korean subject ${note.subjectKorean}`);
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
    `${microTopicIds.size} micro-topics, ${seed.standardMappings.length} mappings. Checksums OK.`,
);
