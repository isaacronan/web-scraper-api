import puppeteer, { Page } from "puppeteer";

type InnerSelector = { type: 'inner', selector: string };
type OuterSelector = { type: 'outer', selector: string };
type AttrSelector = { type: 'attr', selector: string, attr: string };

export type Selector = InnerSelector | OuterSelector | AttrSelector;

export interface Scraper {
    selector: (selectors: Selector[]) => Promise<string[][]>;
}

export interface ScraperMaker {
    make: (scrapeUrl: string) => Scraper;
}

export const createScraper: (pendingPage: Promise<Page>, scrapeUrl: string) => Scraper = (pendingPage, scrapeUrl) => {
    return {
        selector: async (selectors) => {
            const page = await pendingPage;
            const results = await page.evaluate((browserScrapeUrl, browserSelectors) => {
                return fetch(browserScrapeUrl).then(r => r.text()).then(text => {
                    const wrapper = document.createElement('wrapper');
                    wrapper.innerHTML = text;
                    const nodeContentsBySelector = browserSelectors.map(browserSelector => {
                        const nodes = [...wrapper.querySelectorAll(browserSelector.selector)];
                        if (browserSelector.type === 'inner') {
                            return nodes.map(node => node.innerHTML);
                        } else if (browserSelector.type === 'outer') {
                            return nodes.map(node => node.outerHTML);
                        } else if (browserSelector.type === 'attr') {
                            return nodes.map(node => node.attributes.getNamedItem(browserSelector.attr)!.value);
                        }
                        console.error('Unsupported selector: ', browserSelector);
                        return [];
                    });
                    return nodeContentsBySelector;
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
