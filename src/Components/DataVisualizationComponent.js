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

// import a helper that houses some useful functions
import { dataSetHelper } from "../Helpers/helpers";


const DataVisualizationComponent = (props) => {

    // grab JSON url's from helper file
    const fetchAllTickersFromNYSEAndNASDAQURL = dataSetHelper.NYSEAndNASDAQCombination;

    // send snackbar messages to App.js
    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    useEffect(() => {
        fetchJsonDataSets();
    }, [])

    const initialState = {
        stockChartXValues: [],
        stockChartYValues: [],
        grabSelectedTickersName: "",
        grabSelectedTicker: "",
        userDisplayedData: false,
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

    // handle changes in the autocomplete
    const autocompleteOnChange = (e, selectedTicker) => {
        let findStockNameByTicker = "";
        try {
            findStockNameByTicker = state.allDataFromNYSEAndNASDAQArray.find(n => n.ticker === selectedTicker);
        } catch (e) {
            console.log(`error using autocomplete. autocomplete value is null: ${e}`);
        }
        if (selectedTicker) {
            // set stocks name based on user selection
            setState({ grabSelectedTickersName: findStockNameByTicker.name })
            // set stocks ticker based on user selection
            setState({ grabSelectedTicker: findStockNameByTicker.ticker })
        }
    };

    // grab the JSON data sets and load them. called in useEffect
    const fetchJsonDataSets = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendMessageToSnackbar("Attempting to load data from server...");

            let fetchAllTickersFromNYSEAndNASDAQResponse = await fetch(fetchAllTickersFromNYSEAndNASDAQURL);
            let fetchAllTickersFromNYSEAndNASDAQJson = await fetchAllTickersFromNYSEAndNASDAQResponse.json();

            sendMessageToSnackbar("All tickers loaded");

            setState({
                allDataFromNYSEAndNASDAQArray: fetchAllTickersFromNYSEAndNASDAQJson,
                allTickersFromNYSEAndNASDAQArray: fetchAllTickersFromNYSEAndNASDAQJson.map((t) => t.ticker),
            });
        } catch (error) {
            console.log(`error loading JSON data sets: ${error}`);
            sendMessageToSnackbar("Error loading JSON data sets");
        }
    };

    // fetch the data from alphavantage api onclick
    const onViewDataButtonClick = () => {
        console.log(`button click ticker state: ${state.grabSelectedTicker}`);
        setState({ userDisplayedData: true });
        fetchAlphaVantageData(state.grabSelectedTicker);
    }

    // keep button disabled until user inputs some data
    const emptyorundefined =
        state.grabSelectedTicker === "" || state.grabSelectedTicker === undefined;

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center'>
                <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                    <CardHeader
                        title="work in progress"
                        style={{ color: 'black', textAlign: "center" }}
                    />
                    <CardContent>
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.allTickersFromNYSEAndNASDAQArray}
                            getOptionLabel={(option) => option}
                            style={{ width: 300, margin: 'auto', color: theme.palette.primary.main }}
                            onChange={autocompleteOnChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="search by all tickers"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </CardContent>

                    <CardContent>
                        <Button
                            style={{
                                borderRadius: 10,
                                backgroundColor: "lightgray",
                                padding: "10px 20px",
                                fontSize: "18px",
                                marginTop: 20,
                                color: 'black',
                            }}
                            disabled={emptyorundefined}
                            variant="contained"
                            onClick={onViewDataButtonClick}
                        >DISPLAY DATA</Button>
                    </CardContent>

                    <CardContent>
                        {state.userDisplayedData === true &&
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
                                layout={{ width: '50%', height: '50%', /* title: `showing data for ${state.grabSelectedTickersName}` */ }}
                            />
                        }
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
}

export default DataVisualizationComponent;