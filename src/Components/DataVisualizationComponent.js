import React, { useReducer, useEffect, useState } from "react";

import Plot from 'react-plotly.js';

import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    Autocomplete,
    TextField,
    Button,
    Box,
} from "@mui/material";

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

import theme from "../theme";


const DataVisualizationComponent = (props) => {

    // send snackbar messages to App.js
    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    useEffect(() => {
        fetchAlphaVantageData('PLTR');
    }, [])

    const initialState = {
        stockChartXValues: [],
        stockChartYValues: []
    };

    let stockChartXValuesArr = [];
    let stockChartYValuesArr = [];

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);


    const fetchAlphaVantageData = async (ticker) => {
        try {
            // NOTE: can only make 5 api calls per minute, or 500 api calls per day
            let alphavantageUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=${ticker}&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`;

            let alphavantageUrlResponse = await fetch(alphavantageUrl);
            let alphavantageUrlJson = await alphavantageUrlResponse.json();

            for (let date in alphavantageUrlJson['Time Series (Daily)']) {
                console.log(date)
                stockChartXValuesArr.push(date);
                stockChartYValuesArr.push(alphavantageUrlJson['Time Series (Daily)'][date]['1. open']);
            }
            setState({ stockChartXValues: stockChartXValuesArr });
            setState({ stockChartYValues: stockChartYValuesArr });
            sendMessageToSnackbar(`Found data for ${ticker}`);
        } catch (error) {
            sendMessageToSnackbar(`No data for ticker ${ticker}`);
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center'>
                <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                    <CardHeader
                        title="work in progress"
                        style={{ color: 'black', textAlign: "center" }}
                    />
                </Card>

                {/* <DateRange
                    editableDateInputs={true}
                    onChange={item => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                /> */}
                <Plot
                    data={[
                        {
                            x: state.stockChartXValues,
                            y: state.stockChartYValues,
                            type: 'scatter',
                            //mode: 'lines+markers',
                            marker: { color: 'green' },
                        }
                    ]}
                    config={{
                        // turn off modebar on hover
                        displayModeBar: false                     
                    }}
                    layout={{ width: 720, height: 440, title: 'will add title' }}
                />
            </Box>
        </ThemeProvider>
    );
}

export default DataVisualizationComponent;