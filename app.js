const http = require("http");
const coldfilmParser = require('./coldfilmParser');

let series = [];

function getRequest(path) {
    let options = {
        hostname: 'coldfilm.ru',
        port: 80,
        path: path,
        method: 'GET'
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
                let path = data.nextPageLink;
                series = series.concat(data.series);
                if(path) getRequest(path);
            })
    });

    request.on('error', (err) => {
        console.error('123', err);
    });

    request.end();
}

let path = '/search/?q=%D0%98%D0%B3%D1%80%D0%B0+%D0%BF%D1%80%D0%B5%D1%81%D1%82%D0%BE%D0%BB%D0%BE%D0%B2;t=0;p=1;md=news';
getRequest(path);


console.log('serial');
setTimeout(() => {console.log(series)}, 5000);
