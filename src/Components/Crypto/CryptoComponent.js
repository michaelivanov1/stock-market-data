// docs: https://www.coingecko.com/en/api/documentation

import React, { useState, useEffect } from 'react';
import './Crypto.css';

import {
    Card,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";

import CoinComponent from './CoinComponent';

const CryptoComponent = (props) => {

    // send snackbar messages to App.js
    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    const amountOfCurrenciesDisplayed = 100;

    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchApiData();
    }, []);

    const fetchApiData = async () => {
        try {
            let res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${amountOfCurrenciesDisplayed}&page=1&sparkline=false`);
            let json = await res.json();
            setCoins(json);
            sendMessageToSnackbar('Crypto data loaded');
        } catch (err) {
            alert(`error fetching data: ${err}`);
        }
    }

    const handleChange = e => {
        setSearch(e.target.value);
    }

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card>
            <CardContent>
                <Typography variant="h4" color="black" align="center" width="100%" marginBottom="20px">
                    search a coin
                </Typography>
                <div className='coin-app'>
                    <div className='coin-search'>
                        <TextField
                            onChange={handleChange}
                            sx={{
                                width: '300px'
                            }}
                            label="Enter coin here"
                            variant="standard"
                        />
                    </div>
                </div>
            </CardContent>

            <CardContent style={{ marginLeft: '22%', width: "54%", boxShadow: 'none', maxHeight: '600px', overflow: 'auto' }}>
                {filteredCoins.map((coin) => {
                    return (
                        <CoinComponent
                            key={coin.id}
                            name={coin.name}
                            price={coin.current_price}
                            symbol={coin.symbol}
                            marketcap={coin.total_volume}
                            volume={coin.market_cap}
                            image={coin.image}
                            priceChange={coin.price_change_percentage_24h}
                        />
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default CryptoComponent;