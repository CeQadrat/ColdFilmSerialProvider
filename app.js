const ColdFilmSP = require('./coldFilmSerialProvider');

let provider = new ColdFilmSP('Мистер робот');
provider.init().then(() => {
    let generator = provider.getSeries();
    generator.next().value.then((episode) => {
        console.log(episode);
    });
});
