import getWikipediaRevision from './getWikipediaRevision';
import { playwrightCrawler } from '@src/playwrightCrawler';

(async () => {
    const url = 'https://en.wikipedia.org/wiki/Rust_(programming_language)';
    const links = await getWikipediaRevision(url, 10);
    playwrightCrawler.run(links).then((_) => {
        playwrightCrawler.exportData('../data/results.json', 'json');
    });
})();
