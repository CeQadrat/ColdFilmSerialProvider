const serialGen = require('./coldFilmSearchGenerator');
const episodeGen = require('./coldFilmSeriesGenerator');
const co = require('co');

class ColdFilmSP {
    constructor(serialName){
        this.serialName = serialName;
    }
    getSeries(){
        return new Promise((resolve,reject) => {
            co(serialGen(this.serialName)).then((series) => {
                this.series = series;
                resolve(episodeGen);
            })
                .catch(err => console.error(err));
        });
    }
}

module.exports = ColdFilmSP;