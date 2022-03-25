A personal project that fetches American stock market data from "alphavantage" API such as open price, high/low prices, close prices, and volume on any given day.

Users can choose from which stock exchange they would like to see data from. ex: NYSE or NASDAQ

Tickers are fetched from JSON file(s) that are in the data-sets folder in this repository.


HOW TO RUN: 
1) download all files and install all dependencies 
2) get an API key from https://www.alphavantage.co/
3) in a .env file create a variable called REACT_APP_API_KEY and assign it your API key.
      example: REACT_APP_API_KEY = apikeyhere123
4) since this is still in development, run on a local server: npm start
