const http = require('http');
const coldfilmParser = require('./coldfilmParser');
const utf8 = require('utf8');
const co = require('co');

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
                .on('data', (chunk) => {
                    body.push(chunk);
                })
                .on('end', () => {
                    body = Buffer.concat(body).toString();
                    let data = coldfilmParser.updateParser(body);
                    resolve(data);
                })
        });

        request.on('error', (err) => {
            reject(err);
        });

        request.end();

    });
}
let name = 'как';


function* getSerial() {
    let path = '/search/?q=' + utf8.encode(name).split(' ').join('+') + ';t=0;p=1;md=news';
    let series = [];
    while (true) {
        let data = yield getRequest(path);
        path = data.nextPageLink;
        series = series.concat(data.series);
        if (!path) break;
    }
    return series;
}

co(getSerial())
    .then((series) => {
        console.log('Series num = ', series.length);
        console.log(series);
    })
    .catch(err => console.error(err));