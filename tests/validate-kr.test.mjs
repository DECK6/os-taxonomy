import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const ROOT = resolve(import.meta.dirname, '..');
const KR_DATA = resolve(ROOT, 'data', 'kr');

function runValidator(dataDir) {
  return spawnSync(process.execPath, ['scripts/validate-kr.mjs'], {
    cwd: ROOT,
    env: { ...process.env, KR_DATA_DIR: dataDir },
    encoding: 'utf8',
  });
}

function fixture() {
  const dataDir = mkdtempSync(join(tmpdir(), 'os-taxonomy-kr-validator-test-'));
  cpSync(KR_DATA, dataDir, { recursive: true });
  return dataDir;
}

function readJson(dataDir, name) {
  return JSON.parse(readFileSync(resolve(dataDir, name), 'utf8'));
}

function writeJson(dataDir, name, data) {
  const contents = `${JSON.stringify(data, null, 2)}\n`;
  writeFileSync(resolve(dataDir, name), contents);

  const manifestPath = resolve(dataDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.files[name] = {
    bytes: Buffer.byteLength(contents),
    sha256: createHash('sha256').update(contents).digest('hex'),
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function combinedOutput(result) {
  return `${result.stdout}\n${result.stderr}`;
}

function assertRejected(result, ...patterns) {
  assert.notEqual(result.status, 0, 'adversarial KR fixture must fail validation');
  const output = combinedOutput(result);
  for (const pattern of patterns) assert.match(output, pattern);
}

test('KR validation accepts the canonical generated data', () => {
  const baseline = runValidator(KR_DATA);
  assert.equal(baseline.status, 0, baseline.stderr || baseline.stdout);
});

test('KR dependency validation accepts the canonical DAG and rejects a reciprocal cycle', () => {
  const dataDir = fixture();
  const dependencyFile = readJson(dataDir, 'dependencies.json');
  const original = dependencyFile.dependencies.find(
    (candidate) =>
      !dependencyFile.dependencies.some(
        (other) => other.topicId === candidate.prerequisiteId && other.prerequisiteId === candidate.topicId,
      ),
  );
  assert.ok(original, 'expected at least one non-reciprocal dependency edge');
  dependencyFile.dependencies.push({
    ...original,
    topicId: original.prerequisiteId,
    prerequisiteId: original.topicId,
    reason: 'Adversarial regression fixture: reverse an existing prerequisite edge.',
  });
  dependencyFile.edgeCount = dependencyFile.dependencies.length;
  writeJson(dataDir, 'dependencies.json', dependencyFile);

  const mutated = runValidator(dataDir);
  assertRejected(mutated, /reciprocal dependency pair/, /cyclic prerequisite SCC/);
});

test('KR validation executes Draft 2020-12 schemas and rejects sourceUrl aliases for required url fields', () => {
  const dataDir = fixture();
  const standardsFile = readJson(dataDir, 'curriculum-standards.json');
  const source = standardsFile.sources.find((candidate) => candidate.id === 'kr-moe-2022-33-annex5-pdf');
  source.sourceUrl = source.url;
  delete source.url;
  writeJson(dataDir, 'curriculum-standards.json', standardsFile);

  assertRejected(runValidator(dataDir), /JSON Schema curriculum-standards\.json.*required property.*url/, /source .* missing url/);
});

test('KR validation rejects an incomplete standard-to-topic mapping', () => {
  const dataDir = fixture();
  const standardsFile = readJson(dataDir, 'curriculum-standards.json');
  const removed = standardsFile.standardMappings.shift();
  standardsFile.mappingCount = standardsFile.standardMappings.length;
  writeJson(dataDir, 'curriculum-standards.json', standardsFile);

  assertRejected(
    runValidator(dataDir),
    new RegExp(`topic missing standard mapping ${removed.standardKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}->`),
  );
});

test('KR validation rejects reversed topic age ranges', () => {
  const dataDir = fixture();
  const topicsFile = readJson(dataDir, 'topics.json');
  topicsFile.topics[0].ageRangeStart = 12;
  topicsFile.topics[0].ageRangeEnd = 6;
  writeJson(dataDir, 'topics.json', topicsFile);

  assertRejected(runValidator(dataDir), /topic age range reversed/);
});

test('KR validation enforces cluster coverage for every topic', () => {
  const dataDir = fixture();
  const topicsFile = readJson(dataDir, 'topics.json');
  const clustersFile = readJson(dataDir, 'clusters.json');
  const topicId = topicsFile.topics[0].id;
  for (const cluster of clustersFile.clusters) {
    cluster.topics = cluster.topics.filter((id) => id !== topicId);
    cluster.topicCount = cluster.topics.length;
  }
  writeJson(dataDir, 'clusters.json', clustersFile);

  assertRejected(runValidator(dataDir), new RegExp(`topic missing cluster membership ${topicId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
});

test('KR validation rejects placeholder-quality topic fields', () => {
  const dataDir = fixture();
  const topicsFile = readJson(dataDir, 'topics.json');
  const topic = topicsFile.topics.find((candidate) => candidate.subjectKorean === '실과(기술·가정)/정보');
  topic.description = 'x';
  topic.assessmentPrompt = 'x';
  topic.evidence = ['x'];
  topic.generationBasis = 'x';
  writeJson(dataDir, 'topics.json', topicsFile);

  assertRejected(
    runValidator(dataDir),
    /topic description is empty or placeholder-quality/,
    /topic missing evidence/,
    /topic assessmentPrompt is empty or placeholder-quality/,
    /topic missing generationBasis/,
  );
});

test('KR validation rejects unsupported official-source-checked status inflation', () => {
  const dataDir = fixture();
  const standardsFile = readJson(dataDir, 'curriculum-standards.json');
  const standard = standardsFile.curricula
    .flatMap((curriculum) => curriculum.standards)
    .find(
      (candidate) =>
        candidate.verificationStatus !== 'official-source-checked' &&
        !candidate.sourceLocator &&
        !candidate.sourceSection &&
        !candidate.evidence &&
        !candidate.sourceEvidence &&
        !candidate.verificationNotes &&
        !candidate.verificationNote,
    );
  assert.ok(standard, 'expected an unverified standard without review evidence');
  standard.verificationStatus = 'official-source-checked';
  standard.sourceBasis = 'Adversarial placeholder claims a review that has no supporting evidence.';
  writeJson(dataDir, 'curriculum-standards.json', standardsFile);

  assertRejected(runValidator(dataDir), /official-source-checked standard missing verification evidence/);
});

test('KR validation rejects malformed source URLs and missing repository-local sources', () => {
  const malformedDir = fixture();
  const malformedStandards = readJson(malformedDir, 'curriculum-standards.json');
  malformedStandards.sources.find((source) => source.id === 'kr-ncic').url = 'not a valid URL';
  writeJson(malformedDir, 'curriculum-standards.json', malformedStandards);
  assertRejected(runValidator(malformedDir), /source URL\/path invalid kr-ncic/);

  const missingDir = fixture();
  const missingStandards = readJson(missingDir, 'curriculum-standards.json');
  missingStandards.sources.find((source) => source.id === 'kr-project-v03-social-seed').url =
    'file:data/kr/does-not-exist.json';
  writeJson(missingDir, 'curriculum-standards.json', missingStandards);
  assertRejected(runValidator(missingDir), /local source path missing kr-project-v03-social-seed/);
});
