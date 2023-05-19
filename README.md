# web-scraper-api

Simple REST API to retrieve web page content with CSS selectors.

## Endpoints

`GET /scrape`

Query string params:
- `rootUrl` - an arbitrary, lightweight page hosted on the same domain as `scrapeUrl`
- `scrapeUrl` - the page to scrape
- `selectors` - a list of selector strings of the following formats:
    - `inner:::h1`, `inner:::h1.heading img` - returns the inner HTML of the matched element
    - `outer:::h1`, `outer:::h1.heading img` - returns the outer HTML of the matched element
    - `attr:::h1.heading img:::src` - returns the value of the specified attribute on the matched element


Response:
- `results` - a list of string arrays containing the inner HTML of the matched elements