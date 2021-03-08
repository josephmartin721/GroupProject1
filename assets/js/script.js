const top100TableBodyEl = $('#top100-tbody');

// For testing purposes
const tickers = [
    {
        ticker: 'AAPL',
        name: 'Apple, Inc',
        askprice: 119.51
    },
    {
        ticker: 'TSLA',
        name: 'Tesla',
        askprice: 586.38
    },
    {
        ticker: 'GOOG',
        name: 'Alphabet Inc',
        askprice: 2071
    }
]

const displayTop100Table = function(tickers) {
    for (var i = 0; i < tickers.length; i++) {
        let stock = tickers[i];

        top100TableBodyEl.append(`
            <tr>
                <td>${stock.name}</td>
                <td>${stock.ticker}</td>
                <td>&#36;${stock.askprice}</td>
            </tr>
        `);
    }
}

// TODO Api calls to get stock data
// TODO Display stock ticker
// TODO Handle stock symbol search form

