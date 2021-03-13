const RAPID_API_KEY = 'f577c81c30msh97c9a74f04d0771p1126bejsnd343a5c3de13';
const RAPID_API_YAHOO_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
const RAPID_API_FIDELITY_HOST = 'fidelity-investments.p.rapidapi.com';
const mainTableBodyEl = $('#main-tbody');
const symSearch = $('#input').val();
const fidelity = {
        name: 'Fidelity Investments',
        url: 'https://www.fidelity.com/'
    }

Array.prototype.toSymbolsString = function() {
	result = '';
	for (var i = 0; i < this.length - 1; i++) {
  	result += this[i];
    result += '%2C';
  }
  result += this[this.length - 1];
  return result;
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

// Callsback an array of the stock quotes objects ordered in descending order by price percent change greater than 3% with respect to the previous close
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
    callback(data.finance.result[0].quotes);
})
.catch(err => console.error(err));

}

// TODO Display scrolling stock ticker
// TODO Handle stock symbol search form

function validateSubmit() {
    var x = $('input[name="search"]');
    if (x == "") {
      alert("Enter Ticker Symbol");
      return false;
    }
}

const getQuotes = function(symbols, callback) {
    let symbolsStr = symbols.toSymbolsString();
    console.log(symbolsStr);
    fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=" + symbolsStr, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": RAPID_API_YAHOO_HOST
       }})
       .then(response => response.json())
       .then(data => callback(data))
       .catch(err => console.log(err));

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

const displayMainTableBody = function() {

    getDayGainers(function(quotes) {
        let symbols = [];
        // Loops through the quotes object and pushes the stock symbol to the symbols array.    
        for (var i = 0; i < quotes.length; i++) {
            symbols.push(quotes[i].symbol);
        }
        
        getQuotes(symbols, function(quotesData) {
            let quotes = quotesData.quoteResponse.result;
            // loop through quotes and get available platforms
            for (var i = 0; i < quotes.length; i++) {
                let quote = quotes[i];
                console.log(quote);
                mainTableBodyEl.append(`
                <tr>
                    <td>${quote.longName}</td>
                    <td>${quote.symbol}</td>
                    <td>&#36;${quote.ask}</td>
                    <td>Available Platforms</td>
                </tr>
            `);
            }
            
        });
    });
    
}

