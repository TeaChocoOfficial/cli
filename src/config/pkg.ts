// -Path: "cli/src/config/pkg.ts"
import fs from 'fs-extra';
import path from 'node:path';

let current = __dirname;
while (!fs.existsSync(path.join(current, 'package.json'))) current = path.dirname(current);
export const pkg = JSON.parse(fs.readFileSync(path.join(current, 'package.json'), 'utf8'));