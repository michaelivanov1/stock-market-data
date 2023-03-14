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
            <Card
                style={{
                    marginLeft: '20%',
                    width: '60%',
                    boxShadow: 'none',
                    maxHeight: '78vh',
                    overflow: 'auto',
                    backgroundColor: '#f5f5f5', // set a background color for the card
                    borderRadius: '10px', // round the corners of the card
                    border: '1px solid #eaecef', // add a border around the card
                }}
            >
                <CardHeader
                    style={{
                        color: '#333',
                        borderBottom: '1px solid #eaecef',
                        padding: '16px', // add some padding to the header
                    }}
                    title="Description of application"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent style={{ padding: '16px' }}>
                    {/* adjust the font size and line height */}
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                        A personal project made to display American stock market data (and
                        crypto) based on some user request or input. <b>It is a work in
                            progress.</b>
                    </p>
                </CardContent>
                <CardHeader
                    style={{
                        color: '#333',
                        borderBottom: '1px solid #eaecef',
                        padding: '16px',
                    }}
                    title="Features of application"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent style={{ padding: '16px' }}>
                    <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '8px' }}>
                        INDIVIDUAL STOCKS:
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '16px' }}>
                        Users can choose what American stock exchange they would like to view
                        data from.
                        <br />
                        <br />
                        Current exchanges implemented:
                        <br />- ALL (Basically all American stocks)
                        <br />- NYSE
                        <br />- NASDAQ
                        <br />
                        <br />
                        Users can then choose from a list of tickers and a table will be
                        displayed with data such as open/close price, high/low price, and
                        volume.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '8px' }}>
                        ETFs:
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '16px' }}>
                        Users can choose which American ETFs (exchange traded funds) they
                        would like to view data from.
                        <br />
                        Currently there are 500 American ETFs filtered by market cap that
                        the user can choose.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '8px' }}>
                        DATA VISUALIZATION:
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '16px' }}>
                        Users can choose a ticker and a graph will be displayed with the
                        stock data since inception.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '8px' }}>
                        CRYPTO:</p>
                    Users can search/view data for a variable number of coins.
                    <br />
                    Data such as ticker, price, volume, percentage change (24hr), and marketcap.
                </CardContent>
                <CardHeader
                    style={{ color: 'black', borderBottom: '1px solid #eaecef' }}
                    title="Purpose of application"
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>- Widen my knownledge of React.js/JavaScript.
                    <br />- Widen my knowledge of pulling data from API's and JSON files.
                    <br />- Widen my knowledge in using React library's such as MUI.
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