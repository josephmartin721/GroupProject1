const RAPID_API_KEY = 'f577c81c30msh97c9a74f04d0771p1126bejsnd343a5c3de13';
const RAPID_API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
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
                <td>Available Platforms</td>
            </tr>
        `);
    }
}

// API call to get trending stock tickers
// TODO Response error handling
const getTrendingTickers = function(query, callback) {
    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers?region=US`;

    fetch(url, {
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
	        'x-rapidapi-host': RAPID_API_HOST,
	        'useQueryString': true
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

// TODO Display scrolling stock ticker
// TODO Handle stock symbol search form

var symSearch = $('#input').val()
var symSearch = 'AAPL'

const searchSymbol = function(symbol) {
    
fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=" + symbol, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": RAPID_API_KEY,
		"x-rapidapi-host": RAPID_API_HOST
   }})
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(err => console.log(err))
}
searchSymbol ('AAPL')

function validateSubmit() {
    var x = $('input[name="search"]');
    if (x == "") {
      alert("Enter Ticker Symbol");
      return false;
    }
  }