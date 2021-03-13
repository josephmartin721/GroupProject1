const RAPID_API_KEY = 'f577c81c30msh97c9a74f04d0771p1126bejsnd343a5c3de13';
const RAPID_API_YAHOO_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
const RAPID_API_FIDELITY_HOST = 'fidelity-investments.p.rapidapi.com';
const mainTableBodyEl = $('#main-tbody');
const symSearch = $('#input').val();
const fidelity = {
        name: 'Fidelity Investments',
        url: 'https://www.fidelity.com/'
    }

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
// TODO 
const displayMainTable = function(quotes) {
    // get list of symbols
    let symbols = [];
    // Loop through quotes object and push symbol to symbols array
    for (var i = 0; i < quotes.length; i++) {
        symbols.push(quotes[i].symbol);
    }
    let quotes = [];
    // get quotes for all symbols
    getQuotes(symbols, function(data) {
        console.log(data);
        // loop through quotes and get available platforms
    for (var i = 0; i < quotes.length; i++) {
        let quote = quotes[i];

        // getSymbol(quote.symbol, function(data) {
        //     symbol = 
        // })

            mainTableBodyEl.append(`
                <tr>
                    <td>${stock.name}</td>
                    <td>${stock.ticker}</td>
                    <td>&#36;${stock.askprice}</td>
                    <td>Available Platforms</td>
                </tr>
            `);
        }
    });
}

// API call to get trending stock tickers
// TODO Response error handling
const getTrendingTickers = function(query, callback) {
    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers?region=US`;

    fetch(url, {
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
	        'x-rapidapi-host': RAPID_API_HOST,
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

// Returns an array of the most active stocks
const getMostActives = function(callback) {
    const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers?region=US&lang=en-US&start=0&count=6';
    
    fetch(url, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": RAPID_API_KEY,
		"x-rapidapi-host": RAPID_API_YAHOO_HOST
	}
})
.then(response => response.json())
.then(function(data){
    console.log(data);
    callback(data.finance.result[2].quotes);
})
.catch(err => console.error(err));

}

// Returns an array of the stocks ordered in descending order by price percent change greater than 3% with respect to the previous close
const getDayGainers = function(callback) {
    const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers?region=US&lang=en-US&start=0&count=6';
    
    fetch(url, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": RAPID_API_KEY,
		"x-rapidapi-host": RAPID_API_YAHOO_HOST
	}
})
.then(response => response.json())
.then(function(data){
    console.log(data);
    callback(data.finance.result[0].quotes);
})
.catch(err => console.error(err));

}

// TODO Display scrolling stock ticker
// TODO Handle stock symbol search form

const getQuotes = function(symbol, callback) {
    
fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=" + symbol, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": RAPID_API_KEY,
		"x-rapidapi-host": RAPID_API_YAHOO_HOST
   }})
   .then(response => response.json())
   .then(data => callback(data))
   .catch(err => console.log(err))
}


// Returns the fidelity object if there is not an error for the api call. Needs refactoring to add other platforms. 
const getAvailablePlatforms = function(symbol, callback) {
    let platforms = [];

    const url = `https://fidelity-investments.p.rapidapi.com/quotes/get-details?symbols=${symbol}`

    fetch(url, {
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_FIDELITY_HOST,
        }
    })
    .then(response => response.text())
    .then(function(data) {
        console.log(data);
        const parser = new DOMParser();
        // Parses xml string into DOM tree
        const $dom = $(parser.parseFromString(data, 'application/xml'));

        if ($dom.find('STATUS').find('ERROR_CODE').text() === '0') {
            platforms.push(fidelity);
        }

        callback(platforms);
    })
    .catch(function(err) {
        console.log(err);
        callback(platforms);
    });   
}


