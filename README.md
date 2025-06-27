# SimHash Crawler (Example)

## Preparation
Install dependencies:
```bash
npm install
```

## Usage
### Run the crawler
Scrape Wikipedia and generate data/results.json:
```bash
npm run start:dev
```

### Check the report
```bun
npm run start:reportCheck # or tsx utils/reportsReader.ts data/results.json
```