import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

if (typeof payloadRaw !== 'string') {
  throw new Error('Invalid input');
}
if (typeof outputPath !== 'string' || outputPath.length === 0) {
  throw new Error('Invalid output');
}

let payload;
try {
  payload = JSON.parse(payloadRaw);
} catch {
  throw new Error('Invalid input');
}

if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
  throw new Error('Invalid input');
}

const records = payload.records;
const field = payload.field;

if (!Array.isArray(records)) {
  throw new Error('Invalid input');
}
if (typeof field !== 'string' || field.length === 0) {
  throw new Error('Invalid input');
}

let present = 0;
let missing = 0;
let nulls = 0;

for (let i = 0; i < records.length; i += 1) {
  const rec = records[i];
  if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
    throw new Error('Invalid input');
  }
  if (Object.prototype.hasOwnProperty.call(rec, field)) {
    present += 1;
    if (rec[field] === null) nulls += 1;
  } else {
    missing += 1;
  }
}

const result = { missing, nulls, present, total: records.length };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);