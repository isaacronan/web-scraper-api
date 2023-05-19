import puppeteer, { Page } from "puppeteer";

export interface Scraper {
    inner: (selectors: string[]) => Promise<string[][]>;
}

export interface ScraperMaker {
    make: (scrapeUrl: string) => Scraper;
}

export const createScraper: (pendingPage: Promise<Page>, scrapeUrl: string) => Scraper = (pendingPage, scrapeUrl) => {
    return {
        inner: async (selectors) => {
            const page = await pendingPage;
            const results = await page.evaluate((browserScrapeUrl, browserSelectors) => {
                return fetch(browserScrapeUrl).then(r => r.text()).then(text => {
                    const wrapper = document.createElement('wrapper');
                    wrapper.innerHTML = text;
                    const nodesBySelector = browserSelectors.map(browserSelector => [...wrapper.querySelectorAll(browserSelector)]);
                    return nodesBySelector.map(nodes => nodes.map(node => node.innerHTML));
                },);
            }, scrapeUrl, selectors);

            return results;
        }
    }
};

export const createScraperMaker: (rootUrl: string) => ScraperMaker = (rootUrl) => {
    const createPage = async () => {
        console.log('creating browser...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(rootUrl);
        return page;
    }
    const pendingPage = createPage();
    return {
        make: (scrapeUrl) => {
            return createScraper(pendingPage, scrapeUrl);
        }
    }
}
