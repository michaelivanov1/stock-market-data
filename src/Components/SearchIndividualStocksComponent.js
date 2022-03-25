import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Autocomplete,
    TextField,
    TableBody,
} from "@mui/material";
import theme from "../theme";

import Table from '@mui/material/Table';
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// imports for user to pick date
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

// import a helper that houses some useful functions
import getTodaysDate, { dataSetHelper } from "../Helpers/helpers";


const fetchAllTickersFromNYSEURL = dataSetHelper.NYSETickers;
const fetchAllTickersFromNASDAQURL = dataSetHelper.NASDAQTickers;

const SearchIndividualStocksComponent = (props) => {

    // send snackbar messages to App.js
    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    const initialState = {
        // hold all json data fetched from json data sets in "data-sets" folder in my github repo
        allDataFromNYSEArray: [],
        allDataFromNASDAQArray: [],
        // hold just all the ticker values fetched from the json data sets
        allTickersFromNYSEArray: [],
        allTickersFromNASDAQArray: [],
        // bools to determine which data to display
        userSelectedNYSE: false,
        userSelectedNASDAQ: false,
        // holds corresponding stock name based on ticker entered
        grabSelectedTickersName: "",
        // holds user selected date
        grabSelectedDate: getTodaysDate(),
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchJsonDataSets();
    }, []);


    // set dates based on user selection
    const handleDateChange = (date) => {
        setState({ grabSelectedDate: date });
    }
    
    // TODO: format the date correctly: yyyy-mm-dd
    // TODO: get rid of time from the date. i only want the yyyy-mm-dd values
    console.log(`selectedDate: ${state.grabSelectedDate}`)

    // grab stocks name based on selected ticker
    const autocompleteOnChange = (e, selectedTicker) => {
        let findStockNameByTicker = "";

        if (state.userSelectedNYSE) {
            findStockNameByTicker = state.allDataFromNYSEArray.find(n => n.ticker === selectedTicker);
            fetchAlphaVantageData(findStockNameByTicker.ticker);
        } else if (state.userSelectedNASDAQ) {
            findStockNameByTicker = state.allDataFromNASDAQArray.find(n => n.ticker === selectedTicker);
            fetchAlphaVantageData(findStockNameByTicker.ticker);
        }
        if (selectedTicker) setState({ grabSelectedTickersName: findStockNameByTicker.name })
    };

    // grab the JSON data sets and load them. called in useEffect
    const fetchJsonDataSets = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendMessageToSnackbar("Attempting to load data from server...");

            let fetchAllTickersFromNYSEResponse = await fetch(fetchAllTickersFromNYSEURL);
            let fetchAllTickersFromNYSEJson = await fetchAllTickersFromNYSEResponse.json();

            let fetAllTickersFromNASDAQResponse = await fetch(fetchAllTickersFromNASDAQURL);
            let fetchAllTickersFromNASDAQJson = await fetAllTickersFromNASDAQResponse.json();

            sendMessageToSnackbar("All tickers loaded");

            setState({
                allDataFromNYSEArray: fetchAllTickersFromNYSEJson,
                allDataFromNASDAQArray: fetchAllTickersFromNASDAQJson,
                allTickersFromNYSEArray: fetchAllTickersFromNYSEJson.map((t) => t.ticker),
                allTickersFromNASDAQArray: fetchAllTickersFromNASDAQJson.map((t) => t.ticker),
            });

        } catch (error) {
            console.log(`error loading JSON data sets: ${error}`);
            sendMessageToSnackbar("Error loading JSON data sets");
        }
    };

    // call alphavantage API and parse url based on user input
    const fetchAlphaVantageData = async (ticker) => {
        try {
            let alphavantageUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`;

            let alphavantageUrlResponse = await fetch(alphavantageUrl);
            let alphavantageUrlJson = await alphavantageUrlResponse.json();

            // TODO: add ability for user to enter any date in
            console.log(`data retrieved: ${JSON.stringify(alphavantageUrlJson["Time Series (Daily)"]['2022-03-24'])}`);
            sendMessageToSnackbar(`Found data for ${ticker}`);
        } catch (error) {
            sendMessageToSnackbar(`Null data for ticker ${ticker}`);
        }
    }

    // set states for each radio button
    const handleRadioButtonChange = (event) => {
        if (event.target.value === "nyse") {
            setState(state.userSelectedNYSE = true);
            setState(state.userSelectedNASDAQ = false);
            sendMessageToSnackbar(`Found ${state.allTickersFromNYSEArray.length} tickers in NYSE`)
        }
        if (event.target.value === "nasdaq") {
            setState(state.userSelectedNASDAQ = true);
            setState(state.userSelectedNYSE = false);
            sendMessageToSnackbar(`Found ${state.allTickersFromNASDAQArray.length} tickers in NASDAQ`);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Card style={{ marginTop: "10vh" }}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleRadioButtonChange}
                    style={{ justifyContent: 'center' }}
                >
                    <FormControlLabel value="nyse" control={<Radio />} label="NYSE" />
                    <FormControlLabel value="nasdaq" control={<Radio />} label="NASDAQ" />
                </RadioGroup>

                <CardHeader
                    title="Search by ticker"
                    style={{ color: theme.palette.primary.main, textAlign: "center" }}
                />
                <CardContent>
                    <div>
                        <Typography color="error" style={{ textAlign: 'center' }}>{state.msg}</Typography>
                    </div>
                </CardContent>

                <CardContent>
                    {state.userSelectedNYSE &&
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.allTickersFromNYSEArray}
                            getOptionLabel={(option) => option}
                            style={{ width: 300, margin: 'auto', color: theme.palette.primary.main }}
                            onChange={autocompleteOnChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="search by nyse ticker"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    }
                    {state.userSelectedNASDAQ &&
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.allTickersFromNASDAQArray}
                            getOptionLabel={(option) => option}
                            style={{ width: 300, margin: 'auto', color: theme.palette.primary.main }}
                            onChange={autocompleteOnChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="search by nasdaq ticker"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    }
                    <Typography variant="h6" color="green" style={{ textAlign: 'center' }}>
                        {state.grabSelectedTickersName}
                    </Typography>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justifyContent="space-around">
                            <KeyboardDatePicker
                                // disableToolbar
                                // variant=dialog or inline
                                variant="dialog"
                                format="yyy-MM-dd"
                                margin="normal"
                                id="date-picker"
                                label="Pick Date"
                                value={state.grabSelectedDate}
                                onChange={handleDateChange}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>

                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default SearchIndividualStocksComponent;