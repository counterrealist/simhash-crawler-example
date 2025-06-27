import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export default function extractReadableContent(html: string): string {
    try {
        const doc = new JSDOM(html).window.document;
        const article = new Readability(doc).parse();
        return article?.textContent?.trim() ?? '';
    } catch (err) {
        throw new Error(`Readability parsing failed: ${(err as Error).message}`);
    }
}
