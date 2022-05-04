import React, { useState, useEffect } from 'react';
import './Crypto.css';

import {
    Card,
    CardHeader,
    CardContent,
    Autocomplete,
    TextField,
    Box,
    Typography,
} from "@mui/material";

import CoinComponent from './CoinComponent';


const CryptoComponent = () => {

    const amountOfCurrenciesDisplayed = 100;

    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchApiData();
    }, []);

    const fetchApiData = async () => {
        let res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_desc&per_page=${amountOfCurrenciesDisplayed}&page=1&sparkline=false`);
        let json = await res.json();
        setCoins(json);
    }

    const handleChange = e => {
        setSearch(e.target.value);
    }

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
            <div className='coin-app'>
                <div className='coin-search'>
                    <h1 className='coin-text'>Search a coin</h1>
                    <TextField
                        onChange={handleChange}
                        sx={{
                            width: '300px'
                        }}
                        label="Enter coin here"
                        variant="standard"
                    />
                </div>
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
            </div>
        </Card>
    )
}

export default CryptoComponent;
