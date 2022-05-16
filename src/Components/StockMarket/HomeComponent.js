import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import {
    Card,
    CardHeader,
    CardContent,
} from "@mui/material";
import "../../App.css";

const HomeComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <Card style={{ marginLeft: '25%', width: '60%', boxShadow: 'none', maxHeight: '790px', overflow: 'auto' }}>
                <CardHeader
                    style={{ color: 'black', borderBottom: '1px solid #eaecef' }}
                    title="Description of application"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>This application is made to display American stock market data based on some user request or input.<b> It is a work in progress.</b>
                </CardContent>
                <CardHeader
                    style={{ color: 'black', borderBottom: '1px solid #eaecef' }}
                    title="Features of application"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>
                    <p style={{ fontSize: 20, color: 'black' }}>INDIVIDUAL STOCKS:</p>
                    Users can choose what American stock exchange they would like to view data from.
                    <br /><br />
                    Current exchanges implemented:
                    <br />- ALL (Basically all American stocks)
                    <br />- NYSE
                    <br />- NASDAQ
                    <br /><br />Users can then choose from a list of tickers and a table will be displayed with data such as open/close price, high/low price, and volume.
                    <p style={{ fontSize: 20, color: 'black' }}>ETFs:</p>
                    Users can choose which American ETFs (exchange traded funds) they would like to view data from.
                    <br />
                    Currently there are 500 American ETFs filtered by market cap that the user can choose.
                    <p style={{ fontSize: 20, color: 'black' }}>DATA VISUALIZATION:</p>
                    Users can choose a ticker and a graph will be displayed with the stock data since inception.
                    <p style={{ fontSize: 20, color: 'black' }}>CRYPTO:</p>
                    Users can search/view data for a variable number of coins.
                    <br />
                    Data such as ticker, price, volume, percentage change (24hr), and marketcap.
                </CardContent>
                <CardHeader
                    style={{ color: 'black', borderBottom: '1px solid #eaecef' }}
                    title="Purpose of application"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>- Consolidate my knownledge of React.js/JavaScript.
                    <br />- Consolidate my knowledge of pulling from API's and JSON files.
                    <br />- Consolidate my knowledge in using the Material UI Component library for React
                </CardContent>
                <CardHeader
                    style={{ color: 'black', borderBottom: '1px solid #eaecef' }}
                    title="Resources used"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>The API for stock data is alphavantage. This fetches data for the high/low, open/close and volume of stocks.<br />
                    <br />The API for crypto data is coingecko. This fetches data for the name, ticker, price, volume, price change (24hr), and marketcap of coins.<br />
                    <br />The tickers are being pulled from JSON files that I have listed on my <a href="https://github.com/michaelivanov1/stock-market-data">GitHub</a> in the "data-sets" folder.<br />
                </CardContent>
            </Card>
        </ThemeProvider >
    );
};

export default HomeComponent;