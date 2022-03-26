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
} from "@mui/material";
import theme from "../theme";
// imports for date picker
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
// import a helper that houses some useful functions
import { dataSetHelper } from "../Helpers/helpers";
// for formatting date
import moment from "moment";

// grab JSON url's from helper file
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
        // holds ticker that user selected
        grabSelectedTicker: "",
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchJsonDataSets();
    }, []);

    // hooks to hold formatted date based on user input
    const [selectedDate, setDate] = useState(moment());
    const [dateInputValue, setDateInputValue] = useState(moment().format("YYYY-MM-DD"));

    // handle changes in the date selector
    const handleDateChange = (date, value) => {
        // set raw date value
        setDate(date);
        // set formatted date value
        setDateInputValue(value);
        // call alphavantage api function anytime the user changes the date
        fetchAlphaVantageData(state.grabSelectedTicker, value);
    }


    // handle changes in the autocomplete
    const autocompleteOnChange = (e, selectedTicker) => {
        let findStockNameByTicker = "";
        if (state.userSelectedNYSE) {
            try {
                findStockNameByTicker = state.allDataFromNYSEArray.find(n => n.ticker === selectedTicker);
                // call alphavantage api function anytime the user changes the ticker
                fetchAlphaVantageData(findStockNameByTicker.ticker, dateInputValue);
            } catch (e) {
                console.log(`error using autocomplete. autocomplete value is null: ${e}`);
            }
        } else if (state.userSelectedNASDAQ) {
            try {
                findStockNameByTicker = state.allDataFromNASDAQArray.find(n => n.ticker === selectedTicker);
                // call alphavantage api function anytime the user changes the ticker
                fetchAlphaVantageData(findStockNameByTicker.ticker, dateInputValue);
            } catch (e) {
                console.log(`error using autocomplete. autocomplete value is null: ${e}`);
            }
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
    const fetchAlphaVantageData = async (ticker, date) => {
        try {
            // NOTE: can only make 5 api calls per minute, or 500 api calls per day
            let alphavantageUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`;

            let alphavantageUrlResponse = await fetch(alphavantageUrl);
            let alphavantageUrlJson = await alphavantageUrlResponse.json();

            console.log(`data from alphavantage: ${JSON.stringify(alphavantageUrlJson["Time Series (Daily)"][date])}`);
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
            <Card style={{ marginLeft: '25%', marginTop: '5%', width: "50%", border: '1px solid black' }}>
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
                </CardContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around">
                        {/* TODO: the search buttons on the left move when KeyboardDatePicker is uncommented */}
                        <KeyboardDatePicker
                            format="yyyy-MM-dd"
                            margin="normal"
                            label="Pick Date"
                            value={selectedDate}
                            inputValue={dateInputValue}
                            onChange={handleDateChange}
                            disableFuture
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </Card>
        </ThemeProvider>
    );
};

export default SearchIndividualStocksComponent;