const htmlparser = require("htmlparser2");

function updateParser(str){
    let startParse = false;
    let parser = new htmlparser.Parser({
        onopentag: (name, attribs) => {
            if(name === "a" && attribs.class === "entryLink"){
                console.log(attribs.href);
                startParse = true;
            }
        },
        ontext: (text) => {
            if(startParse){
                console.log(text);
            }
        },
        onclosetag: (tagname) => {
            if(tagname === "a" && startParse === true){
                startParse = false;
                console.log("____________________________________________________________________________");
            }
        }
    }, {decodeEntities: true});
    parser.write(str);
    parser.end();
}

module.exports.updateParser = updateParser;