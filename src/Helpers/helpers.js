import { parseISO } from 'date-fns';

// grab todays date
export default function getTodaysDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    // parseISO used so the day doesn't lag behind by 1
    return parseISO(today);
}

// hold json data sets
const dataSetHelper = {
    NYSETickers: `https://raw.githubusercontent.com/michaelivanov1/stock-market-data/master/data-sets/all-nyse-tickers-2022.json`,
    NASDAQTickers: `https://raw.githubusercontent.com/michaelivanov1/stock-market-data/master/data-sets/all-nasdaq-tickers-2022.json`,
}

export { dataSetHelper };