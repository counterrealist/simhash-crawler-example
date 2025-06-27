export default async function getWikipediaRevision(articleUrl: string, limit: number = 10): Promise<string[]> {
    try {
        const urlObj = new URL(articleUrl);
        const lang = urlObj.hostname.split('.')[0];
        const title = decodeURIComponent(urlObj.pathname.split('/wiki/')[1]);

        const params = new URLSearchParams({
            action: 'query',
            prop: 'revisions',
            titles: title,
            rvlimit: limit.toString(),
            rvprop: 'ids|timestamp',
            format: 'json',
            formatversion: '2',
            origin: '*',
        });

        const apiUrl = `https://${lang}.wikipedia.org/w/api.php?${params.toString()}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const revisions = data?.query?.pages?.[0]?.revisions ?? [];

        return revisions.map(
            (rev: { revid: number }) => `https://${lang}.wikipedia.org/w/index.php?oldid=${rev.revid}`,
        );
    } catch (err) {
        return [];
    }
}
