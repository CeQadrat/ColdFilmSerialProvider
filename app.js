const http = require("http");


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
            console.log(`BODY: ${chunk}`);
        })
        .on('end', () => {
            console.log('end')
        })
});

request.on('error', (err) => {
    console.error('123', err);
});

request.end();