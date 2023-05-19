import express from 'express';
import { Scraper, ScraperMaker, Selector, createScraperMaker } from './scraper';

const app = express();
const PORT = 3004;

const scrapers: { [rootUrl: string]: { [scrapeUrl: string]: Scraper }} = {};
const scraperMakers: { [rootUrl: string]: ScraperMaker } = {};

const paramToSelector: (param: string) => Selector = (param) => {
    const [type, selector, attr] = param.split(':::') as [string, string, string?];
    if (attr !== undefined) {
        return { type, selector, attr} as Selector;
    }
    return { type, selector } as Selector;
};

app.get('/scrape', async (req, res) => {
    const { rootUrl, scrapeUrl, selector } = req.query as { rootUrl: string, scrapeUrl: string, selector: string };
    console.log(rootUrl, scrapeUrl, selector);
    if (!scraperMakers[rootUrl]) {
        scraperMakers[rootUrl] = createScraperMaker(rootUrl);
    }
    if (!scrapers[rootUrl]) {
        scrapers[rootUrl] = {};
    }
    if (!scrapers[rootUrl][scrapeUrl]) {
        scrapers[rootUrl][scrapeUrl] = scraperMakers[rootUrl].make(scrapeUrl);
    }
    const results = await scrapers[rootUrl][scrapeUrl].selector(Array.isArray(selector) ? selector.map(paramToSelector) : [paramToSelector(selector)]);
    res.json({
        results
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});