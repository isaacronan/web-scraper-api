# web-scraper-api

Simple REST API to retrieve web page content with CSS selectors.

## Endpoints

`GET /scrape`

Query string params:
- `rootUrl` - an arbitrary, lightweight page hosted on the same domain as `scrapeUrl`
- `scrapeUrl` - the page to scrape
- `selector` - a CSS selector

Response:
- `results` - a list of strings containing the inner HTML of the matched elements