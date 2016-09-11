const http = require("http");
const coldfilmParser = require('./coldfilmParser');

function getRequest(path,parser){
    let options = {
        hostname: path,
        port: 80,
        path: '/',
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
                parser(body);
            })
    });

    request.on('error', (err) => {
        console.error('123', err);
    });

    request.end();
}

getRequest('coldfilm.ru', (chunk) => {
    let series = coldfilmParser.updateParser(chunk);
    console.log('serial');
    console.log(series);
});