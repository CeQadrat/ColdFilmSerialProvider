const htmlparser = require("htmlparser2");

function updateParser(str){
    let startParse = false;
    let newSeries = [];
    let serial = {};
    let parser = new htmlparser.Parser({
        onopentag: (name, attribs) => {
            if(name === "a" && attribs.class === "entryLink"){
                serial.href = attribs.href;
                startParse = true;
            }
        },
        ontext: (text) => {
            if(startParse){
                serial.name = text.slice(0,-18);
            }
        },
        onclosetag: (tagname) => {
            if(tagname === "a" && startParse === true){
                startParse = false;
                newSeries.push(serial);
                serial = {};
            }
        }
    }, {decodeEntities: true});
    parser.write(str);
    parser.end();
    return newSeries;
}

module.exports.updateParser = updateParser;