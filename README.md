# web-scraper-api

Simple REST API to retrieve web page content with CSS selectors.

## Endpoints

`GET /scrape`

Query string params:
- `rootUrl` - an arbitrary, lightweight page hosted on the same domain as `scrapeUrl`
- `scrapeUrl` - the page to scrape
- `selectors` - a list of CSS selectors

Response:
- `results` - a list of string arrays containing the inner HTML of the matched elements