#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentQualityErrors, repairWorkstreamContent } from './lib/kr-content-quality.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSTREAM_DIR = resolve(ROOT, 'data', 'kr', 'workstreams');
const files = readdirSync(WORKSTREAM_DIR)
  .filter((name) => name.endsWith('.json'))
  .sort();

let topicCount = 0;
for (const file of files) {
  const path = resolve(WORKSTREAM_DIR, file);
  const artifact = JSON.parse(readFileSync(path, 'utf8'));
  const repaired = repairWorkstreamContent(artifact);
  const errors = contentQualityErrors(repaired.microTopics || []);
  if (errors.length) {
    throw new Error(`${file} content repair left ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  }
  topicCount += repaired.microTopics?.length || 0;
  writeFileSync(path, `${JSON.stringify(repaired, null, 2)}\n`);
}

console.log(`Repaired ${files.length} KR workstreams (${topicCount} topics).`);
