const searchParser = require('../parsers/coldFilmSearchParser');
const utf8 = require('utf8');
const getPage = require('./getPageRequest');

module.exports = function* getSerial(name) {
    let path = generatePath(name);
    let series = [];
    do{
        let body = yield getPage(path);
        let data = searchParser.parse(body);
        path = data.nextPageLink;
        series = series.concat(data.series);
    } while(path);
    series.sort((s1,s2) => {
        if(s1.date > s2.date) return -1;
        if(s1.date < s2.date) return 1;
    });
    return series;
};

function generatePath(name){
    return '/search/?q=' + utf8.encode(name).split(' ').join('+') + ';t=0;p=1;md=news';
}
