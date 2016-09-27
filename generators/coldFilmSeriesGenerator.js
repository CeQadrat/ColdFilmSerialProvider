const seriesParser = require('../parsers/coldFilmSeriesParser');
const getPage = require('./getPageRequest');

module.exports = function* getEpisode(series) {
    for(let episode of series) {
        let path = episode.link.slice(18);
        let series = {
            serialName: episode.name,
            season: episode.season,
            series: episode.series,
            date: episode.date
        };
        yield new Promise((resolve,reject) => {
            getPage(path)
                .then((data) => {
                    data = seriesParser.parse(data);
                    series.serialCover = data.serialCover;
                    series.links = {
                        linksToWatch: data.sourceLinks,
                        torrentLinks: data.torrentLinks
                    };
                    resolve(series);
                })
                .catch(err => reject(err));
        });
    }
};
