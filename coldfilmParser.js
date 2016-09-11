const htmlparser = require("htmlparser2");

function updateParser(str){
    let parseLink = false;
    let parseName = false;
    let parseDate = false;
    let parseNextPage = false;
    let nextPageLink = '';
    let newSeries = [];
    let serial = {};
    let parser = new htmlparser.Parser({
        onopentag: (name, attribs) => {
            if(name === "div" && attribs.class === "eTitle"){
                parseLink = true;
            }
            if(name === 'a' && parseLink) {
                serial.link = attribs.href;
            }
            if(name === 'b' && parseLink){
                parseName = true;
                if(serial.name) serial.name += ' ';
                else serial.name = '';
            }
            if(name === "div" && attribs.class === "eDetails"){
                parseDate = true;
            }
            if(name === 'a' && attribs.class === 'swchItem'){
                nextPageLink = attribs.href.slice(13);
                parseNextPage = true;
            }
        },
        ontext: (text) => {
            if(parseLink && !parseName){
                text = text.slice(1,-19);
                text = text.split(' ');
                serial.season = text[0];
                serial.series = text[2];
            }
            if(parseName){
                serial.name += text;
            }
            if(parseDate){
                serial.date = new Date(text);
            }
            if(parseNextPage){
                if(text != '»') nextPageLink = null;
            }
        },
        onclosetag: (tagname) => {
            if(tagname === "a" && parseLink){
                parseLink = false;
            }
            if(tagname === "b" && parseName){
                parseName = false;
            }
            if(tagname === "div" && parseDate){
                parseDate = false;
                newSeries.push(serial);
                serial = {};
            }
            if(tagname === "a" && parseNextPage){
                parseNextPage = false;
            }
        }
    }, {decodeEntities: true});
    parser.write(str);
    parser.end();
    return {
        series: newSeries,
        nextPageLink: nextPageLink
    };
}

module.exports.updateParser = updateParser;