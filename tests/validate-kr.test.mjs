import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const ROOT = resolve(import.meta.dirname, '..');

function runValidator(dataDir) {
  return spawnSync(process.execPath, ['scripts/validate-kr.mjs'], {
    cwd: ROOT,
    env: { ...process.env, KR_DATA_DIR: dataDir },
    encoding: 'utf8',
  });
}

test('KR dependency validation accepts the canonical DAG and rejects a reciprocal cycle', () => {
  const baseline = runValidator(resolve(ROOT, 'data', 'kr'));
  assert.equal(baseline.status, 0, baseline.stderr || baseline.stdout);

  const dataDir = mkdtempSync(join(tmpdir(), 'os-taxonomy-kr-dag-test-'));
  cpSync(resolve(ROOT, 'data', 'kr'), dataDir, { recursive: true });

  const dependencyPath = resolve(dataDir, 'dependencies.json');
  const dependencyFile = JSON.parse(readFileSync(dependencyPath, 'utf8'));
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
  writeFileSync(dependencyPath, `${JSON.stringify(dependencyFile, null, 2)}\n`);

  const mutated = runValidator(dataDir);
  assert.notEqual(mutated.status, 0, 'reciprocal cycle must fail KR validation');
  const output = `${mutated.stdout}\n${mutated.stderr}`;
  assert.match(output, /reciprocal dependency pair/);
  assert.match(output, /cyclic prerequisite SCC/);
});
