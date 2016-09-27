const serialGen = require('./generators/coldFilmSearchGenerator');
const episodeGen = require('./generators/coldFilmSeriesGenerator');
const co = require('co');

module.exports = class ColdFilmSP {
    constructor(serialName){
        this.serialName = serialName;
    }
    getSeries(){
        let serialName = this.serialName;
        let episodes = this.series;
        return function* () {
            yield new Promise((resolve,reject) => {
                co(serialGen(serialName)).then((series) => {
                    episodes = series;
                    resolve();
                })
                    .catch(err => console.error(err));
            });
            yield* episodeGen(episodes);
        }
    }
    getInfo(){
        return {
            provider: 'coldfilm.ru'
        }
    }
};