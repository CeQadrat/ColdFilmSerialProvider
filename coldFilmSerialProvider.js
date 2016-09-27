const serialGen = require('./generators/coldFilmSearchGenerator');
const episodeGen = require('./generators/coldFilmSeriesGenerator');
const co = require('co');

module.exports = class ColdFilmSP {
    constructor(serialName){
        this.serialName = serialName;
    }
    init(){
        let self = this;
        return new Promise((resolve,reject) => {
            co(serialGen(self.serialName)).then((series) => {
                self.series = series;
                resolve();
            })
                .catch(err => reject(err));
        });
    }
    getSeries(){
        return episodeGen(this.series);
    }
    getInfo(){
        return {
            provider: 'coldfilm.ru'
        }
    }
};
