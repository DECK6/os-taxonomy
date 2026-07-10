#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KR_DATA = process.env.KR_DATA_DIR ? resolve(process.env.KR_DATA_DIR) : resolve(ROOT, 'data', 'kr');
const load = (name) => JSON.parse(readFileSync(resolve(KR_DATA, name), 'utf8'));
const bytesOf = (name) => readFileSync(resolve(KR_DATA, name));

const MIN_TOPICS = 1500;
const TYPES = new Set(['CONCEPTUAL', 'PROCEDURAL', 'REPRESENTATIONAL', 'LANGUAGE', 'META']);
const REL = new Set(['introduces', 'supports', 'extends', 'assesses']);
const STR = new Set(['hard', 'soft']);
const VER = new Set(['official-source-checked', 'public-doc-derived', 'needs-official-code-check']);
const KR_CODE = /^\[[246](국|수|과|사|영|도|실|바|슬|즐|미|음|체)[0-9]{2}-[0-9]{2}\]$/;

const errors = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const hasEvidence = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => isNonEmptyString(item) || (item && typeof item === 'object' && Object.keys(item).length > 0));

const standardsFile = load('curriculum-standards.json');
const topicsFile = load('topics.json');
const depsFile = load('dependencies.json');
const clustersFile = load('clusters.json');
const manifest = load('manifest.json');

check(standardsFile.locale === 'ko-KR', 'curriculum-standards locale must be ko-KR');
check(standardsFile.country === 'KR', 'curriculum-standards country must be KR');
check(standardsFile.textPolicy?.standardTextIncluded === false, 'standardTextIncluded must be false');
check(VER.has(standardsFile.verificationStatus), `bad top verificationStatus ${standardsFile.verificationStatus}`);
check(standardsFile.sourceCount === standardsFile.sources?.length, 'sourceCount mismatch');
check(standardsFile.curriculumCount === standardsFile.curricula?.length, 'curriculumCount mismatch');
check(topicsFile.topicCount === topicsFile.topics?.length, 'topicCount mismatch');
check(depsFile.edgeCount === depsFile.dependencies?.length, 'edgeCount mismatch');
check(clustersFile.clusterCount === clustersFile.clusters?.length, 'clusterCount mismatch');
check(topicsFile.topicCount >= MIN_TOPICS, `KR topic target missed: ${topicsFile.topicCount} < ${MIN_TOPICS}`);
check(depsFile.graphPolicy?.relation === 'prerequisite', 'dependency graph relation must be prerequisite');
check(depsFile.graphPolicy?.acyclic === true, 'dependency graph policy must require acyclic=true');
check(depsFile.graphPolicy?.edgeSelection === 'workstream-reviewed-only', 'dependency graph must use workstream-reviewed-only edges');
check(manifest.counts?.topics === topicsFile.topicCount, 'manifest topic count mismatch');
check(manifest.counts?.dependencies === depsFile.edgeCount, 'manifest dependency count mismatch');
check(manifest.counts?.clusters === clustersFile.clusterCount, 'manifest cluster count mismatch');
check(manifest.counts?.curricula === standardsFile.curriculumCount, 'manifest curriculum count mismatch');
check(manifest.counts?.standards === standardsFile.standardCount, 'manifest standard count mismatch');

const sourceIds = new Set((standardsFile.sources || []).map((source) => source.id));
const standardKeys = new Set();
const subjectByEnglish = new Map();
const subjectByKorean = new Map();
let standardCount = 0;

for (const curriculum of standardsFile.curricula || []) {
  check(curriculum.id === curriculum.slug, `curriculum slug mismatch ${curriculum.id}`);
  check(curriculum.country === 'KR', `curriculum country mismatch ${curriculum.id}`);
  check(curriculum.textIncluded === false, `curriculum textIncluded false required ${curriculum.id}`);
  check(curriculum.standardCount === curriculum.standards?.length, `standardCount mismatch ${curriculum.id}`);
  check(VER.has(curriculum.verificationStatus), `bad curriculum verification ${curriculum.id}`);
  subjectByEnglish.set(curriculum.subject, curriculum.subjectKorean);
  subjectByKorean.set(curriculum.subjectKorean, curriculum.subject);

  for (const standard of curriculum.standards || []) {
    standardCount += 1;
    check(standard.key === `${curriculum.id}:${standard.code}`, `standard key mismatch ${standard.key}`);
    check(KR_CODE.test(standard.code), `bad KR code ${standard.code}`);
    check(standard.sourceTextIncluded === false, `sourceTextIncluded false required ${standard.key}`);
    check(standard.officialTextIncluded !== true, `officialTextIncluded true not allowed ${standard.key}`);
    check(VER.has(standard.verificationStatus), `bad standard verification ${standard.key}`);
    check(isNonEmptyString(standard.sourceBasis), `missing sourceBasis ${standard.key}`);
    check(isNonEmptyString(standard.summary), `missing summary ${standard.key}`);
    for (const ref of standard.sourceRefs || []) check(sourceIds.has(ref), `unknown sourceRef ${ref}`);
    if (standardKeys.has(standard.key)) errors.push(`duplicate standard key ${standard.key}`);
    standardKeys.add(standard.key);
  }
}

check(standardsFile.standardCount === standardCount, `standardCount ${standardsFile.standardCount} != ${standardCount}`);

const topicIds = new Set();
for (const topic of topicsFile.topics || []) {
  check(topic.id?.startsWith('kr.mt.'), `bad topic id ${topic.id}`);
  check(TYPES.has(topic.type), `bad topic type ${topic.id}: ${topic.type}`);
  check(isNonEmptyString(topic.subject), `topic missing subject ${topic.id}`);
  check(subjectByEnglish.get(topic.subject) === topic.subjectKorean, `topic subject mismatch ${topic.id}`);
  check(isNonEmptyString(topic.name) || isNonEmptyString(topic.title), `topic missing name/title ${topic.id}`);
  check(isNonEmptyString(topic.description), `topic missing description ${topic.id}`);
  check(hasEvidence(topic.evidence), `topic missing evidence ${topic.id}`);
  check(isNonEmptyString(topic.assessmentPrompt), `topic missing assessmentPrompt ${topic.id}`);
  check(!topic.assessmentPrompt?.includes('{{'), `topic prompt still has template token ${topic.id}`);
  check(Array.isArray(topic.standards) && topic.standards.length > 0, `topic missing standards ${topic.id}`);
  for (const key of topic.standards || []) check(standardKeys.has(key), `topic ${topic.id} unknown standard ${key}`);
  if (topic.subjectKorean === '영어') {
    check(topic.subject === 'English as a Foreign Language', `English topic must be EFL, not ELA: ${topic.id}`);
  }
  if (topic.subjectKorean === '사회') {
    const haystack = `${topic.description} ${topic.summary || ''} ${JSON.stringify(topic.evidence)}`;
    check(!/\b(Common Core|US state|United States|UK national)\b/i.test(haystack), `social topic has non-KR default framing ${topic.id}`);
  }
  if (topicIds.has(topic.id)) errors.push(`duplicate topic id ${topic.id}`);
  topicIds.add(topic.id);
}

check(standardsFile.microTopicCount === topicIds.size, `microTopicCount ${standardsFile.microTopicCount} != ${topicIds.size}`);

const mappingPairs = new Set();
for (const mapping of standardsFile.standardMappings || []) {
  check(standardKeys.has(mapping.standardKey), `mapping unknown standard ${mapping.standardKey}`);
  check(topicIds.has(mapping.microTopicId), `mapping unknown topic ${mapping.microTopicId}`);
  check(REL.has(mapping.relationship), `bad mapping relationship ${mapping.standardKey}->${mapping.microTopicId}`);
  const pair = `${mapping.standardKey}->${mapping.microTopicId}`;
  if (mappingPairs.has(pair)) errors.push(`duplicate mapping ${pair}`);
  mappingPairs.add(pair);
}
check(standardsFile.mappingCount === mappingPairs.size, `mappingCount ${standardsFile.mappingCount} != ${mappingPairs.size}`);

const dependencyPairs = new Set();
for (const dep of depsFile.dependencies || []) {
  check(topicIds.has(dep.topicId), `dependency unknown topic ${dep.topicId}`);
  check(topicIds.has(dep.prerequisiteId), `dependency unknown prerequisite ${dep.prerequisiteId}`);
  check(dep.topicId !== dep.prerequisiteId, `self dependency ${dep.topicId}`);
  check(STR.has(dep.strength), `bad dependency strength ${dep.topicId}->${dep.prerequisiteId}`);
  check(isNonEmptyString(dep.reason), `dependency missing reason ${dep.topicId}->${dep.prerequisiteId}`);
  const pair = `${dep.topicId}->${dep.prerequisiteId}`;
  if (dependencyPairs.has(pair)) errors.push(`duplicate dependency ${pair}`);
  dependencyPairs.add(pair);
}

const reciprocalPairs = [];
for (const pair of dependencyPairs) {
  const [topicId, prerequisiteId] = pair.split('->');
  const reverse = `${prerequisiteId}->${topicId}`;
  if (dependencyPairs.has(reverse) && pair.localeCompare(reverse) < 0) reciprocalPairs.push([topicId, prerequisiteId]);
}
check(
  reciprocalPairs.length === 0,
  `dependency graph has ${reciprocalPairs.length} reciprocal dependency pair(s)${reciprocalPairs[0] ? `; example ${reciprocalPairs[0].join(' <-> ')}` : ''}`,
);

const adjacency = new Map([...topicIds].map((id) => [id, []]));
for (const dep of depsFile.dependencies || []) {
  if (adjacency.has(dep.topicId) && adjacency.has(dep.prerequisiteId) && dep.topicId !== dep.prerequisiteId) {
    adjacency.get(dep.topicId).push(dep.prerequisiteId);
  }
}

let nextIndex = 0;
const indices = new Map();
const lowLinks = new Map();
const stack = [];
const onStack = new Set();
const cyclicSccs = [];

function visitScc(topicId) {
  indices.set(topicId, nextIndex);
  lowLinks.set(topicId, nextIndex);
  nextIndex += 1;
  stack.push(topicId);
  onStack.add(topicId);

  for (const prerequisiteId of adjacency.get(topicId) || []) {
    if (!indices.has(prerequisiteId)) {
      visitScc(prerequisiteId);
      lowLinks.set(topicId, Math.min(lowLinks.get(topicId), lowLinks.get(prerequisiteId)));
    } else if (onStack.has(prerequisiteId)) {
      lowLinks.set(topicId, Math.min(lowLinks.get(topicId), indices.get(prerequisiteId)));
    }
  }

  if (lowLinks.get(topicId) !== indices.get(topicId)) return;
  const component = [];
  let member;
  do {
    member = stack.pop();
    onStack.delete(member);
    component.push(member);
  } while (member !== topicId);
  if (component.length > 1) cyclicSccs.push(component.sort());
}

for (const topicId of topicIds) if (!indices.has(topicId)) visitScc(topicId);
check(
  cyclicSccs.length === 0,
  `dependency graph must be a DAG; found ${cyclicSccs.length} cyclic prerequisite SCC(s)${cyclicSccs[0] ? `; example ${cyclicSccs[0].join(' -> ')}` : ''}`,
);

for (const cluster of clustersFile.clusters || []) {
  check(subjectByEnglish.get(cluster.subject) === cluster.subjectKorean, `cluster subject mismatch ${cluster.id}`);
  check(cluster.topicCount === cluster.topics?.length, `cluster topicCount mismatch ${cluster.id}`);
  check(isNonEmptyString(cluster.summary), `cluster missing summary ${cluster.id}`);
  check(isNonEmptyString(cluster.parentSummary), `cluster missing parentSummary ${cluster.id}`);
  for (const id of cluster.topics || []) check(topicIds.has(id), `cluster unknown topic ${id}`);
}

for (const [name, meta] of Object.entries(manifest.files || {})) {
  const bytes = bytesOf(name);
  const hash = createHash('sha256').update(bytes).digest('hex');
  check(bytes.length === meta.bytes, `manifest bytes mismatch ${name}`);
  check(hash === meta.sha256, `manifest checksum mismatch ${name}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} KR problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `✓ KR full-depth data valid - ${standardsFile.curricula.length} curricula, ${standardKeys.size} standards, ${topicIds.size} topics, ${depsFile.dependencies.length} dependencies, ${clustersFile.clusters.length} clusters. Checksums OK.`,
);
