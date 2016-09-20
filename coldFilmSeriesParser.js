const htmlParser = require("htmlparser2");

function coldFilmSeriesParser(parseString){
    let enableParse = false;
    let enableParseTorrentLink = false;

    let serialCover = '';
    let sourceLinks = [];
    let torrentLinks = [];
    let torrent = {};
    let serialName = '';

    let parser = new htmlParser.Parser({
        onopentag: (name, attribs) => {
            if(name === "td" && attribs.class === "eMessage"){
                enableParse = true;
            }
            if(name === 'img' && enableParse) {
                serialCover = attribs.src;
                serialName = attribs.alt;
                serialName = serialName.slice(0,serialName.indexOf('серия')+5);
            }
            if(name === "iframe" && enableParse){
                sourceLinks.push(attribs.src);
            }
            if(name === 'a' && enableParse){
                enableParseTorrentLink = true;
                torrent.link = attribs.href;
            }
        },
        ontext: (text) => {
            if(enableParseTorrentLink){
                torrent.info = text;
            }
        },
        onclosetag: (tagname) => {
            if(tagname === "td" && enableParse){
                enableParse = false;
            }
            if(tagname === "a" && enableParseTorrentLink){
                enableParseTorrentLink = false;
                torrentLinks.push(torrent);
                torrent = {};
            }
        }
    }, {decodeEntities: true});
    parser.write(parseString);
    parser.end();
    return {
        serialName,
        serialCover,
        sourceLinks,
        torrentLinks
    };
}

module.exports = coldFilmSeriesParser;
