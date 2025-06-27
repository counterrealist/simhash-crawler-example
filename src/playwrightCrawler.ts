import { Configuration, PlaywrightCrawler } from 'crawlee';
import extractReadableContent from '@src/extractReadableContent';
import { SimHash } from '@counterrealist/simhash';

const simHash = new SimHash();

export const playwrightCrawler = new PlaywrightCrawler(
    {
        maxRequestsPerCrawl: 50,
        requestHandler: async function ({ pushData, request, page, log }) {
            log.info(`Processing ${request.loadedUrl}...`);
            const html = await page.content();
            const text = extractReadableContent(html);
            const hash = simHash.compute_hex(text);
            await pushData({
                url: request.loadedUrl,
                hash: hash,
                datetime: Date.now(),
            });
        },
        failedRequestHandler: function ({ request, log }) {
            log.info(`Request ${request.url} failed too many times.`);
        },
        minConcurrency: 10,
        maxConcurrency: 100,
        maxRequestRetries: 3,
    },
    new Configuration({
        persistStorage: false,
        headless: true,
    }),
);
