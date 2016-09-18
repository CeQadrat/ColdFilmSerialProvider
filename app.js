const http = require('http');
const coldFilmParsers = require('./coldFilmParsers');
const utf8 = require('utf8');
const co = require('co');

function getRequest(path,parser) {
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
                    let data = parser(body);
                    resolve(data);
                })
        });

        request.on('error', (err) => {
            reject(err);
        });

        request.end();

    });
}
let name = 'Мистер робот';

function* getSerial() {
    let path = '/search/?q=' + utf8.encode(name).split(' ').join('+') + ';t=0;p=1;md=news';
    let series = [];
    while (true) {
        let data = yield getRequest(path,coldFilmParsers.searchParser);
        path = data.nextPageLink;
        series = series.concat(data.series);
        if (!path) break;
    }
    return series;
}

co(getSerial())
    .then((series) => {
        console.log('Series num = ', series.length);
        series.sort((s1,s2) => {
            if(s1.date > s2.date) return 1;
            if(s1.date < s2.date) return -1;
        });
        console.log(series);
    })
    .catch(err => console.error(err));

getRequest('/news/mister_robot_1_sezon_10_serija_smotret_onlajn/2015-09-03-2677',coldFilmParsers.seriesParser)
    .then((data) => {
        console.log('Series: ');
        console.log(data);
    })
    .catch(err => console.error(err));