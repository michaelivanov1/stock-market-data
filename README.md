**This is a personal project I am working on over a long period of time to get very familiar with React, it is not done.**

**STOCK MARKET:**

Fetch American stock market data from the "alphavantage" API such as open/close price, high/low price, and volume on any weekday.
Users can also view an interactive chart which displays stock data along with date selection.

Users can choose from which stock exchange they would like to see data from. ex: NYSE or NASDAQ, or ALL public American companies.

Users can view data for individual stocks or ETFs in the form of tables & charts. 

Tickers are fetched from JSON file(s) that are in the data-sets folder in this repository.

**CRYPTO**

Fetch crypto data from the "coingecko" API such as ticker, price, mkt cap, volume, daily percentage changed.


HOW TO RUN: 
1) download all files and install all dependencies 
2) get an API key from https://www.alphavantage.co/
3) in a .env file create a variable called REACT_APP_API_KEY and assign it your API key.
      ex: REACT_APP_API_KEY = apikeyhere123
4) run on a local server using npm start, or view it hosted: https://stockmarket-data-visualizer.herokuapp.com/home
