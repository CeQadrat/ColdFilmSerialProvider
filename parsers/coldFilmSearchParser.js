const htmlParser = require('htmlparser2');

module.exports = {
    parse(page){
        let {series, nextPageLink} = this._parse(page);
        return {series, nextPageLink}
    },
    _parse(page){
        let enableParseLink = false;
        let enableParseDate = false;
        let enableParseNextPage = false;

        let nextPageLink = '';
        let serialTitle = '';
        let series = [];
        let serial = {};

        let parser = new htmlParser.Parser({
            onopentag: (name, attribs) => {
                if(name === 'div' && attribs.class === 'eTitle'){
                    enableParseLink = true;
                }
                if(name === 'a' && enableParseLink) {
                    serial.link = attribs.href;
                }
                if(name === 'div' && attribs.class === 'eDetails'){
                    enableParseDate = true;
                }
                if(name === 'a' && attribs.class === 'swchItem'){
                    nextPageLink = attribs.href.slice(13);
                    enableParseNextPage = true;
                }
            },
            ontext: (text) => {
                if(enableParseLink){
                    serialTitle +=text;
                }
                if(enableParseDate){
                    serial.date = new Date(text);
                }
                if(enableParseNextPage){
                    if(text != '»') nextPageLink = null;
                }
            },
            onclosetag: (tagname) => {
                if(tagname === 'a' && enableParseLink){
                    serial.name = '';
                    serialTitle = serialTitle.slice(1,-19);
                    serialTitle = serialTitle.split(' ');
                    serialTitle.forEach((item, i, arr) => {
                        if(isNaN(item) && enableParseLink) serial.name += item+' ';
                        else enableParseLink = false;
                        if(item == 'сезон') serial.season = arr[i-1];
                        if(item == 'серия') serial.series = arr[i-1];
                    });
                    serial.name = serial.name.slice(0,-1);
                    serialTitle = '';
                }
                if(tagname === 'div' && enableParseDate){
                    enableParseDate = false;
                    series.push(serial);
                    serial = {};
                }
                if(tagname === 'a' && enableParseNextPage){
                    enableParseNextPage = false;
                }
            }
        }, {decodeEntities: true});
        parser.write(page);
        parser.end();
        return {
            series,
            nextPageLink
        };
    }
};
