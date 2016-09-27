const ColdFilmSP = require('./coldFilmSerialProvider');
const co = require('co');


let provider = new ColdFilmSP('Мистер робот');
let gener = provider.getSeries()();
gener.next().value.then(() => {
    gener.next().value.then((episode) => {
        console.log(episode);
    })
});
