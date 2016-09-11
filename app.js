const http = require("http");
const coldfilmParser = require('./coldfilmParser');

let options = {
    hostname: 'coldfilm.ru',
    port: 80,
    path: '/',
    method: 'GET'
};

let request = http.request(options, (res) => {
    res.setEncoding('utf-8');
    res
        .on('data', (chunk) => {
            coldfilmParser.updateParser(chunk);
        })
        .on('end', () => {
            console.log('end')
        })
});

request.on('error', (err) => {
    console.error('123', err);
});

request.end();