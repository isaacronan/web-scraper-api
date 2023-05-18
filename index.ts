import express from 'express';
import { Scraper, ScraperMaker, createScraperMaker } from './scraper';

const app = express();
const PORT = 3004;

const scrapers: { [rootUrl: string]: { [scrapeUrl: string]: Scraper }} = {};
const scraperMakers: { [rootUrl: string]: ScraperMaker } = {};

app.get('/scrape', async (req, res) => {
    const { rootUrl, scrapeUrl, selector } = req.query as { rootUrl: string, scrapeUrl: string, selector: string };
    if (!scraperMakers[rootUrl]) {
        scraperMakers[rootUrl] = createScraperMaker(rootUrl);
    }
    if (!scrapers[rootUrl]) {
        scrapers[rootUrl] = {};
    }
    if (!scrapers[rootUrl][scrapeUrl]) {
        scrapers[rootUrl][scrapeUrl] = scraperMakers[rootUrl].make(scrapeUrl);
    }
    const results = await scrapers[rootUrl][scrapeUrl].inner(selector);
    res.json({
        results
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});