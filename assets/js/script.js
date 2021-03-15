const RAPID_API_KEY = 'f577c81c30msh97c9a74f04d0771p1126bejsnd343a5c3de13';
const RAPID_API_YAHOO_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
const RAPID_API_FIDELITY_HOST = 'fidelity-investments.p.rapidapi.com';
const mainTableBodyEl = $('#main-tbody');
const searchInputEl = $('#search');

// ** Variables for testing display **
const fidelity = {
    name: 'Fidelity Investments',
    url: 'https://www.fidelity.com/'
}
const robinhood = {
    name: 'Robinhood',
    url: 'https://robinhood.com/'
}
const platforms = [fidelity, robinhood];
//*************************************

// ** Utilites **********************************
Array.prototype.toSymbolsString = function() {
	result = '';
	for (var i = 0; i < this.length - 1; i++) {
  	result += this[i];
    result += '%2C';
  }
  result += this[this.length - 1];
  return result;
}
// **********************************************

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

// Callsback an array of the most active stock objects
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
    var x = $('#search').val();
    if (x == "") {
        $("#search").html("Please enter symbol")
        .addClass("error-msg");
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

// Returns an array of platform objects that sucessfully returns quote data. Needs refactoring to add other platforms. 
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
// TODO Use this for testing display only because API calls are limited.
const getAvailablePlatformsSimulator = function(symbol, callback) {
    callback(platforms);
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
            
            for (var i = 0; i < quotes.length; i++) {
                let quote = quotes[i];
                // Loops through quotes and gets the available platforms
                getAvailablePlatformsSimulator(quote.symbol, function(platforms) {
                    let platformsInnerHtml = '';
                    // loops through platforms and creates platforms html content
                    for (var i = 0; i < platforms.length; i++) {
                        let platform = platforms[i];
                        platformsInnerHtml += `<span class="platforms"><a href=${platform.url}>${platform.name}</a></span>`;
                    }
                    mainTableBodyEl.append(`
                        <tr>
                            <td>${quote.longName}</td>
                            <td>${quote.symbol}</td>
                            <td>&#36;${quote.ask}</td>
                            <td>${platformsInnerHtml}</td>
                        </tr>
                    `);
                })
                
            }
            
        });
    });   
}

const displaySearchResults = function() {
    mainTableBodyEl.empty();
    let parseMatch = /\s|,/
    // Splits search inputs on spaces or commas
    let symbols = searchInputEl.val().split(parseMatch);
    console.log(symbols);
    getQuotes(symbols, function(quotesData) {
        let quotes = quotesData.quoteResponse.result;
        
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
}

$('#search-button').click(displaySearchResults)
