const got = require('got');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

module.exports = (db, parameters) => {
    if(parameters?.start) {
        const start = parameters.start;
        const end = parameters.end ?? parameters.start;
        let promises = [];

        for(let i = start; i <= end; i++) {
            promises.push(crawl(db, i));
        }
        return Promise.all(promises);
    } else {
        return Promise.resolve(null);
    }
}

function crawl(db, id) {
    const base = 'https://www.hafh.com/properties/';

    return got(base + id.toString(10)).then(response => scrape(db, response.body));
}

function scrape(db, body) {
    const document = (new JSDOM(body)).window.document;

    if(document.querySelector('title')) {
        let data = JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent).props.pageProps.initialState.property.property;
        const id = data.id;
        delete data.id;
        delete data.nearby;

        return db.collection('properties').doc(id.toString(10)).set(data);
    } else {
        return Promise.resolve(null);
    }
}