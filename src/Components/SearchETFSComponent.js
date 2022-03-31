import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
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

// grab JSON url from helper file
const fetchAllEtfsFromFile = dataSetHelper.AmericanETFs;

const SearchETFSComponent = (props) => {

    // send snackbar messages to App.js
    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    const initialState = {
        // holds all data from json file
        allDataFromEtfFileArray: [],
        // holds all tickers from json file
        allTickersFromEtfFileArray: [],
        // holds corresponding etf name based on ticker entered
        grabSelectedTickersName: "",
        // hold ticker that user selected
        grabSelectedTicker: "",
        // bools to determine which components to display based on if user is selecting the filters
        userSelectedATicker: false,
        userFilteredByDate: false,
        userClickedDisplayData: false,
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
        fetchJsonDataSet();
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
        let findETFNameByTicker = "";

        try {
            findETFNameByTicker = state.allDataFromEtfFileArray.find(n => n.Symbol === selectedTicker);
            setState({ userSelectedATicker: true });
        } catch (e) {
            console.log(`error using autocomplete. autocomplete value is null: ${e}`);
        }
        if (selectedTicker) {
            // set ETFs name based on user selection
            setState({ grabSelectedTickersName: findETFNameByTicker.Name });
            // set ETFs ticker based on user selection
            setState({ grabSelectedTicker: findETFNameByTicker.Symbol });
        }
    };

    // grab the JSON data set and load it. called in useEffect
    const fetchJsonDataSet = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendMessageToSnackbar("Attempting to load data from server...");

            let fetchAllEtfsFromFileResponse = await fetch(fetchAllEtfsFromFile);
            let fetchAllEtfsFromFileJson = await fetchAllEtfsFromFileResponse.json();

            sendMessageToSnackbar("All tickers loaded");

            setState({
                allDataFromEtfFileArray: fetchAllEtfsFromFileJson,
                allTickersFromEtfFileArray: fetchAllEtfsFromFileJson.map((s) => s.Symbol),
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
        state.grabSelectedTicker === "" || state.grabSelectedTicker === undefined;


    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center'>
                <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                    <CardHeader
                        title="Search an ETF:"
                        style={{ color: 'black', textAlign: "center" }}
                    />

                    <CardContent>
                        <div>
                            <Typography color="error" style={{ textAlign: 'center' }}>{state.msg}</Typography>
                        </div>
                    </CardContent>

                    <CardContent>
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.allTickersFromEtfFileArray}
                            getOptionLabel={(option) => option}
                            style={{ width: 300, margin: 'auto', color: theme.palette.primary.main }}
                            onChange={autocompleteOnChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="search american etfs"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </CardContent>

                    {state.userSelectedATicker &&
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

                    {state.userFilteredByDate &&
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
                {state.userFilteredByDate && state.userSelectedATicker && state.userClickedDisplayData &&
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

export default SearchETFSComponent;