import React from 'react';
import './Coin.css';

import {
    Card,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";

const CoinComponent = ({
    name,
    price,
    symbol,
    marketcap,
    volume,
    image,
    priceChange
}) => {
    return (
        <Card className='coin-container'>
            <Card className='coin-row'>
                <div className='coin'>
                    <img src={image} alt='crypto' />
                    <h1>{name}</h1>
                    <p className='coin-symbol'>{symbol}</p>
                </div>
                <div className='coin-data'>
                    <p className='coin-price'>${price}</p>
                    <p className='coin-marketcap'>Mkt cap: ${volume.toLocaleString()}</p>

                    {priceChange < 0 ? (
                        <p className='coin-percent red'>{priceChange.toFixed(2)}%</p>
                    ) : (
                        <p className='coin-percent green'>{priceChange.toFixed(2)}%</p>
                    )}

                    <p className='coin-volume'>
                        Volume: {marketcap.toLocaleString()}
                    </p>
                </div>
            </Card>
        </Card>
    );
};

export default CoinComponent;