const coldFilmParsers = require('./coldFilmParsers');
const http = require('http');

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

function* getEpisode() {
    let series = this.series;
    for(let episode of series) {
        let path = episode.link.slice(18);
        let series = {
            serialName: episode.name,
            season: episode.season,
            series: episode.series,
            date: episode.date
        };
        yield new Promise((resolve,reject) => {
            getRequest(path)
                .then((data) => {
                    data = coldFilmParsers.seriesParser(data);
                    series.serialCover = data.serialCover;
                    series.links = {
                        linksToWatch: data.sourceLinks,
                        torrentLinks: data.torrentLinks
                    };
                    resolve(series);
                })
                .catch(err => reject(err));
        });
    };
}

module.exports = getEpisode;