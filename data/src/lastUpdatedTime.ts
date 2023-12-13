import { OUTPUT_PATH, OVERWRITE } from './context/config';

import * as fs from 'fs';
import * as path from 'path';

const lastUpdatedFile = path.join(OUTPUT_PATH, 'lastUpdatedTime.json');

if (OVERWRITE || !fs.existsSync(lastUpdatedFile)) {
  const time = new Date().toISOString();
  const data = JSON.stringify({ lastUpdatedTime: time }, null, 2);

  fs.writeFileSync(lastUpdatedFile, data, 'utf8');
  console.log('Last updated time written to file:', time);
} else {
  console.log(`The ${lastUpdatedFile} file already exists.`);
}