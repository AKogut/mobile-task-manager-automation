#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SOURCE = join(REPO_ROOT, 'app/src/constants/testIds.ts');
const OUTPUT = join(
  REPO_ROOT,
  'android-tests/src/androidTest/kotlin/com/mobiletaskmanager/TestIds.kt',
);

const KOTLIN_TYPES = { number: 'Int', string: 'String' };

const contents = readFileSync(SOURCE, 'utf8');

const block = contents.match(
  /export const TestIds = \{(.+?)\} as const;/s,
)?.[1];
if (!block) {
  throw new Error(`Could not locate the TestIds object in ${SOURCE}`);
}

const entries = [...block.matchAll(/^\s*([A-Za-z0-9_]+):\s*'([^']*)',?\s*$/gm)];
if (entries.length === 0) {
  throw new Error(`No testID entries found in ${SOURCE}`);
}

const constants = entries.map(
  ([, key, value]) => `  const val ${key} = "${value}"`,
);

const functions = [
  ...contents.matchAll(
    /export function (\w+)\((\w+): (number|string)\): string \{\s*return `([^`]+)`;\s*\}/g,
  ),
];

const functionLines = functions.map(([, name, param, tsType, template]) => {
  const kotlinType = KOTLIN_TYPES[tsType];
  const kotlinTemplate = template.replaceAll(`\${${param}}`, `$${param}`);
  return `  fun ${name}(${param}: ${kotlinType}): String = "${kotlinTemplate}"`;
});

const body = [...constants];
if (functionLines.length > 0) {
  body.push('', ...functionLines);
}

writeFileSync(
  OUTPUT,
  `package com.mobiletaskmanager

object TestIds {
${body.join('\n')}
}
`,
);

console.log(
  `Generated ${relative(REPO_ROOT, OUTPUT)} ` +
    `(${entries.length} identifiers, ${functions.length} helpers).`,
);
