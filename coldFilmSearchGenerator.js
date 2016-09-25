const coldFilmParsers = require('./coldFilmParsers');
const utf8 = require('utf8');
const http = require('http');

function generatePath(name){
    return '/search/?q=' + utf8.encode(name).split(' ').join('+') + ';t=0;p=1;md=news';
}

function getRequest(path) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'coldfilm.ru',
            port: 80,
            method: 'GET',
            path
        };
        let request = http.request(options, (res) => {
            let body = [];
            res
                .on('data', chunk => body.push(chunk))
                .on('end', () => {
                    body = Buffer.concat(body).toString();
                    resolve(body);
                })
        });

        request.on('error', reject);

        request.end();
    });
}

function* getSerial(name) {
    let path = generatePath(name);
    let series = [];
    do{
        let body = yield getRequest(path);
        let data = coldFilmParsers.searchParser(body);
        path = data.nextPageLink;
        series = series.concat(data.series);
    } while(path);
    series.sort((s1,s2) => {
        if(s1.date > s2.date) return 1;
        if(s1.date < s2.date) return -1;
    });
    return series;
}

module.exports = getSerial;
