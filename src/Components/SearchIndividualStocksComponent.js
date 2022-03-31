import React, { useReducer, useEffect } from "react";
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
    Button,
    Box
} from "@mui/material";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
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
        // bools to determine which components to display based on if user is selecting the filters
        userFilteredByExchange: false,
        userFilteredByDate: false,
        userSelectedATicker: false,
        userClickedDisplayData: false,
        // holds corresponding stock name based on ticker entered
        grabSelectedTickersName: "",
        // hold ticker that user selected
        grabSelectedTicker: "",
        // hold formatted and unformatted dates
        unformattedDate: moment(),
        formattedDate: moment().format("YYYY-MM-DD"),
        // data from alphavantage object: open, high, low, close, volume
        openPrice: [],
        highPrice: [],
        lowPrice: [],
        closePrice: [],
        volume: [],
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchJsonDataSets();
    }, []);

    // handle changes in the date selector
    const handleDateChange = (unformattedDate, formattedDate) => {
        // set raw date value
        setState({ unformattedDate: unformattedDate });
        // set formatted date value
        setState({ formattedDate: formattedDate });
        setState({ userFilteredByDate: true })
        console.log(`handleDateChange unformatted date: ${unformattedDate}`);
        console.log(`handleDateChange formatted date: ${formattedDate}`);
    }

    // handle changes in the autocomplete
    const autocompleteOnChange = (e, selectedTicker) => {
        let findStockNameByTicker = "";
        if (state.userSelectedNYSE) {
            try {
                findStockNameByTicker = state.allDataFromNYSEArray.find(n => n.ticker === selectedTicker);
                setState({ userSelectedATicker: true });
            } catch (e) {
                console.log(`error using autocomplete. autocomplete value is null: ${e}`);
            }
        } else if (state.userSelectedNASDAQ) {
            try {
                findStockNameByTicker = state.allDataFromNASDAQArray.find(n => n.ticker === selectedTicker);
                setState({ userSelectedATicker: true });
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
            let alphavantageUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=${ticker}&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`;

            let alphavantageUrlResponse = await fetch(alphavantageUrl);
            let alphavantageUrlJson = await alphavantageUrlResponse.json();

            console.log(`data from alphavantage: ${JSON.stringify(alphavantageUrlJson["Time Series (Daily)"][date])}`);
            // set data for each property in fetched alphavantage object
            setState({ openPrice: alphavantageUrlJson["Time Series (Daily)"][date]['1. open'] });
            setState({ highPrice: alphavantageUrlJson["Time Series (Daily)"][date]['2. high'] });
            setState({ lowPrice: alphavantageUrlJson["Time Series (Daily)"][date]['3. low'] });
            setState({ closePrice: alphavantageUrlJson["Time Series (Daily)"][date]['4. close'] });
            setState({ volume: alphavantageUrlJson["Time Series (Daily)"][date]['5. volume'] });
            sendMessageToSnackbar(`Found data for ${ticker}`);
        } catch (error) {
            sendMessageToSnackbar(`No data for ticker ${ticker}`);
        }
    }

    // set states for each radio button
    const handleRadioButtonChange = (event) => {
        if (event.target.value === "nyse") {
            setState(state.userSelectedNYSE = true);
            setState(state.userSelectedNASDAQ = false);
            setState({ userFilteredByExchange: true });
            sendMessageToSnackbar(`Found ${state.allTickersFromNYSEArray.length} tickers in NYSE`)
        }
        if (event.target.value === "nasdaq") {
            setState({ userSelectedNASDAQ: true });
            setState({ userSelectedNYSE: false });
            setState({ userFilteredByExchange: true });
            sendMessageToSnackbar(`Found ${state.allTickersFromNASDAQArray.length} tickers in NASDAQ`);
        }
    }

    // disable weekends
    function disableWeekends(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    // fetch the data from alphavantage api onclick
    const onViewDataButtonClick = () => {
        console.log(`button click ticker state: ${state.grabSelectedTicker}`);
        console.log(`button click date state: ${state.formattedDate}`);
        fetchAlphaVantageData(state.grabSelectedTicker, state.formattedDate);
        setState({ userClickedDisplayData: true });
    }

    // keep button disabled until user inputs some data
    const emptyorundefined =
        state.grabSelectedTicker === "" || state.grabSelectedTicker === undefined ||
        state.formattedDate === "" || state.formattedDate === undefined;

        

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center'>
                <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                    <CardHeader
                        title="Filter by stock exchange:"
                        style={{ color: 'black', textAlign: "center" }}
                    />

                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={handleRadioButtonChange}
                        style={{ justifyContent: 'center' }}
                    >
                        <FormControlLabel value="nyse" control={<Radio />} label="NYSE" labelPlacement="top" />
                        <FormControlLabel value="nasdaq" control={<Radio />} label="NASDAQ" labelPlacement="top" />
                    </RadioGroup>

                    <CardContent>
                        <div>
                            <Typography color="error" style={{ textAlign: 'center' }}>{state.msg}</Typography>
                        </div>
                    </CardContent>

                    {state.userFilteredByExchange &&
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <CardHeader
                                title="Filter by date:"
                                style={{ color: 'black', textAlign: "center" }}
                            />
                            <Grid>
                                <KeyboardDatePicker
                                    format="yyyy-MM-dd"
                                    margin="normal"
                                    label="Pick Date"
                                    value={state.unformattedDate}
                                    inputValue={state.formattedDate}
                                    onChange={handleDateChange}
                                    disableFuture
                                    InputProps={{ readOnly: true }}
                                    shouldDisableDate={disableWeekends}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    }

                    <CardContent>
                        {state.userSelectedNYSE && state.userFilteredByDate &&
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
                        {state.userSelectedNASDAQ && state.userFilteredByDate &&
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
                    </CardContent>

                    {state.userFilteredByExchange && state.userFilteredByDate &&
                        <Button
                            style={{
                                borderRadius: 10,
                                backgroundColor: "lightgray",
                                padding: "10px 20px",
                                fontSize: "18px",
                                marginTop: 20,
                            }}
                            disabled={emptyorundefined}
                            variant="contained"
                            onClick={onViewDataButtonClick}
                        >DISPLAY DATA</Button>
                    }
                </Card>
                {state.userFilteredByExchange && state.userFilteredByDate && state.userSelectedATicker && state.userClickedDisplayData &&
                    <TableContainer
                        className="tableStyles">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ fontSize: 14, borderBottom: '1px solid black', backgroundColor: 'lightgray' }}>Name</TableCell>
                                    <TableCell align="center" style={{ fontSize: 14, borderBottom: '1px solid black', backgroundColor: 'lightgray' }}>Open price</TableCell>
                                    <TableCell align="center" style={{ fontSize: 14, borderBottom: '1px solid black', backgroundColor: 'lightgray' }}>High</TableCell>
                                    <TableCell align="center" style={{ fontSize: 14, borderBottom: '1px solid black', backgroundColor: 'lightgray' }}>Low</TableCell>
                                    <TableCell align="center" style={{ fontSize: 14, borderBottom: '1px solid black', backgroundColor: 'lightgray' }}>Close price</TableCell>
                                    <TableCell align="center" style={{ fontSize: 14, borderBottom: '1px solid black', backgroundColor: 'lightgray' }}>Volume</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{ marginTop: 50, borderTop: '2px solid green' }}>
                                <TableRow>
                                    <TableCell align={'center'} style={{ width: '20%', backgroundColor: 'silver' }}>{state.grabSelectedTickersName}</TableCell>
                                    <TableCell align={'center'} style={{ width: '15%', backgroundColor: 'silver' }}>{state.openPrice}</TableCell>
                                    <TableCell align={'center'} style={{ width: '15%', backgroundColor: 'silver' }}>{state.highPrice}</TableCell>
                                    <TableCell align={'center'} style={{ width: '15%', backgroundColor: 'silver' }}>{state.lowPrice}</TableCell>
                                    <TableCell align={'center'} style={{ width: '15%', backgroundColor: 'silver' }}>{state.closePrice}</TableCell>
                                    <TableCell align={'center'} style={{ width: '15%', backgroundColor: 'silver' }}>{state.volume}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Box>
        </ThemeProvider>
    );
};

export default SearchIndividualStocksComponent;