const seriesParser = require('../parsers/coldFilmSeriesParser');
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

function* getEpisode(series) {
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
                    data = seriesParser.parse(data);
                    series.serialCover = data.serialCover;
                    series.links = {
                        linksToWatch: data.sourceLinks,
                        torrentLinks: data.torrentLinks
                    };
                    // console.log(series);
                    resolve(series);
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = getEpisode;