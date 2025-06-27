import * as fs from 'fs';
import { SimHash } from '@counterrealist/simhash';

const simhash = new SimHash();

interface WikiRevision {
    url: string;
    hash: string;
    datetime: number;
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Please provide the JSON filename as an argument.');
    process.exit(1);
}

const filePath = args[0];

try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const revisions: WikiRevision[] = JSON.parse(jsonData);

    revisions.sort((a, b) => a.datetime - b.datetime);

    for (let i = 0; i < revisions.length - 1; i++) {
        const rev1 = revisions[i];
        const rev2 = revisions[i + 1];

        const similarity = simhash.similarityFromHex(rev1.hash, rev2.hash);

        console.log(`Pair ${i + 1}:`);
        console.log(`  1) Datetime: ${new Date(rev1.datetime).toISOString()}, Hash: ${rev1.hash}`);
        console.log(`  2) Datetime: ${new Date(rev2.datetime).toISOString()}, Hash: ${rev2.hash}`);
        console.log(`  Similarity: ${similarity.toFixed(4)}`);
        console.log('---');
    }
} catch (err) {
    console.error('Error reading JSON file:', err);
    process.exit(1);
}
