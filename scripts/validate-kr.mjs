#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KR_DATA = resolve(ROOT, 'data', 'kr');
const load = (name) => JSON.parse(readFileSync(resolve(KR_DATA, name), 'utf8'));
const bytesOf = (name) => readFileSync(resolve(KR_DATA, name));
const errors=[]; const check=(c,m)=>{if(!c)errors.push(m)};
const seed=load('curriculum-standards.seed.json');
const topics=load('topics.seed.json');
const deps=load('dependencies.seed.json');
const clusters=load('clusters.seed.json');
const manifest=load('manifest.json');
const VER=new Set(['official-source-checked','public-doc-derived','needs-official-code-check']);
const TYPES=new Set(['CONCEPTUAL','PROCEDURAL','REPRESENTATIONAL','LANGUAGE','META']);
const REL=new Set(['introduces','supports','extends','assesses']);
const STR=new Set(['hard','soft']);
check(seed.locale==='ko-KR','seed locale must be ko-KR');
check(seed.country==='KR','seed country must be KR');
check(seed.textPolicy?.standardTextIncluded===false,'standardTextIncluded must be false');
check(VER.has(seed.verificationStatus),`bad top verificationStatus ${seed.verificationStatus}`);
check(seed.sourceCount===seed.sources?.length,`sourceCount mismatch`);
check(seed.curriculumCount===seed.curricula?.length,`curriculumCount mismatch`);
check(seed.standardCount===seed.curricula?.reduce((n,c)=>n+(c.standards?.length||0),0),`standardCount mismatch`);
check(seed.microTopicCount===seed.microTopics?.length,`microTopicCount mismatch in seed`);
check(seed.mappingCount===seed.standardMappings?.length,`mappingCount mismatch`);
check(topics.topicCount===topics.topics?.length,`topics file topicCount mismatch`);
check(deps.edgeCount===deps.dependencies?.length,`dependency edgeCount mismatch`);
check(clusters.clusterCount===clusters.clusters?.length,`clusterCount mismatch`);
check(topics.topicCount===seed.microTopicCount,`topics file count ${topics.topicCount} != seed ${seed.microTopicCount}`);
const sourceIds=new Set((seed.sources||[]).map(s=>s.id));
const standardKeys=new Set(); const subjects=new Map();
for (const c of seed.curricula||[]) {
  check(c.slug===c.id,`slug mismatch ${c.id}`); check(c.country==='KR',`country mismatch ${c.id}`); check(c.textIncluded===false,`textIncluded false required ${c.id}`);
  check(c.standardCount===c.standards?.length,`standardCount mismatch ${c.id}`); subjects.set(c.subject,c.subjectKorean);
  for (const s of c.standards||[]) {
    check(s.key===`${c.id}:${s.code}`,`key mismatch ${s.key}`); check(/^\[[246](국|수|과|사|영|도|실|바|슬|즐|미|음|체)[0-9]{2}-[0-9]{2}\]$/.test(s.code),`bad KR code ${s.code}`);
    check(s.sourceTextIncluded===false,`sourceTextIncluded false required ${s.key}`); check(VER.has(s.verificationStatus),`bad verification ${s.key}`);
    check(typeof s.sourceBasis==='string' && s.sourceBasis.length>0,`missing sourceBasis ${s.key}`); for (const ref of s.sourceRefs||[]) check(sourceIds.has(ref),`unknown sourceRef ${ref}`);
    if (standardKeys.has(s.key)) errors.push(`duplicate standard key ${s.key}`); standardKeys.add(s.key);
  }
}
const topicIds=new Set();
for (const t of topics.topics||[]) {
  check(t.id?.startsWith('kr.mt.'),`bad topic id ${t.id}`); check(TYPES.has(t.type),`bad topic type ${t.id}`); check(subjects.get(t.subject)===t.subjectKorean,`topic subject mismatch ${t.id}`);
  check(Array.isArray(t.standards) && t.standards.length>0,`topic missing standards ${t.id}`); for (const key of t.standards||[]) check(standardKeys.has(key),`topic ${t.id} unknown standard ${key}`);
  if (topicIds.has(t.id)) errors.push(`duplicate topic id ${t.id}`); topicIds.add(t.id);
}
const seedTopicIds=new Set((seed.microTopics||[]).map(t=>t.id));
check(seedTopicIds.size===topicIds.size && [...topicIds].every(id=>seedTopicIds.has(id)), 'seed microTopics and topics.seed.json diverge');
const mapPairs=new Set();
for (const m of seed.standardMappings||[]) {
  check(standardKeys.has(m.standardKey),`mapping unknown standard ${m.standardKey}`); check(topicIds.has(m.microTopicId),`mapping unknown topic ${m.microTopicId}`); check(REL.has(m.relationship),`bad relationship ${m.standardKey}`);
  const pair=`${m.standardKey}->${m.microTopicId}`; if(mapPairs.has(pair)) errors.push(`duplicate mapping ${pair}`); mapPairs.add(pair);
}
for (const d of deps.dependencies||[]) {
  check(topicIds.has(d.topicId),`dependency unknown topic ${d.topicId}`); check(topicIds.has(d.prerequisiteId),`dependency unknown prerequisite ${d.prerequisiteId}`); check(d.topicId!==d.prerequisiteId,`self dependency ${d.topicId}`); check(STR.has(d.strength),`bad strength ${d.topicId}`);
}
for (const cl of clusters.clusters||[]) {
  check(subjects.get(cl.subject)===cl.subjectKorean,`cluster subject mismatch ${cl.id}`); check(cl.topicCount===cl.topics?.length,`cluster topicCount mismatch ${cl.id}`); for (const id of cl.topics||[]) check(topicIds.has(id),`cluster unknown topic ${id}`);
}
for (const [name,meta] of Object.entries(manifest.files||{})) { const b=bytesOf(name); const h=createHash('sha256').update(b).digest('hex'); check(b.length===meta.bytes,`manifest bytes mismatch ${name}`); check(h===meta.sha256,`manifest checksum mismatch ${name}`); }
if(errors.length){ console.error(`✗ ${errors.length} KR problem(s):`); for(const e of errors) console.error(`  - ${e}`); process.exit(1); }
console.log(`✓ KR expanded seed valid - ${seed.curricula.length} curricula, ${standardKeys.size} standards, ${topicIds.size} topics, ${deps.dependencies.length} dependencies, ${clusters.clusters.length} clusters. Checksums OK.`);
