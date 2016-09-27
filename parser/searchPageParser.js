const searchPagePaginationParser = require('./serchPagePaginationParser');
const listOfSeriesParser = require('./listOfSeriesParser');

module.exports = {
    parse(page) {
        let {pagination, listOfSeries} = this._parse(page);

        let {currentPage, maxPage} = searchPagePaginationParser.parse(pagination);
        let pageSeries = searchPagePaginationParser.parse(listOfSeries);

        return {currentPage, maxPage, pageSeries};
    },

    _parse(page) {
        return {pagination: 'some', listOfSeries: 'another'};
    }
};
