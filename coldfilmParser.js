const htmlparser = require("htmlparser2");

function updateParser(str){
    let parseLink = false;
    let parseDate = false;
    let parseNextPage = false;
    let nextPageLink = '';
    let serialTitle = '';
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
            if(name === "div" && attribs.class === "eDetails"){
                parseDate = true;
            }
            if(name === 'a' && attribs.class === 'swchItem'){
                nextPageLink = attribs.href.slice(13);
                parseNextPage = true;
            }
        },
        ontext: (text) => {
            if(parseLink){
                serialTitle +=text;
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
                serialTitle = serialTitle.slice(1,-19);
                serialTitle = serialTitle.split(' ');
                serial.name = '';
                serialTitle.forEach((item, i, arr) => {
                    if(isNaN(item) && parseLink) serial.name += item+' ';
                    else parseLink = false;
                    if(item == 'сезон') serial.season = arr[i-1];
                    if(item == 'серия') serial.series = arr[i-1];
                });
                serial.name = serial.name.slice(0,-1);
                serialTitle = '';
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