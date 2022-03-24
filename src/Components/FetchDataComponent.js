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
// helper that holds json data sets
import { dataSetHelper } from "../DataSetHelper/dataSetHelper";

//const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=PLTR&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`;
//const url2 = `https://api.exchangerate-api.com/v4/latest/USD`;

const fetchAllTickersFromNYSEURL = dataSetHelper.NYSETickers;
const fetchAllTickersFromNASDAQURL = dataSetHelper.NASDAQTickers;

const FetchDataComponent = (props) => {

    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    const initialState = {
        // hold all json data fetched from json data sets in "data-sets" folder in my github repo
        allDataFromNYSEArray: [],
        allDataFromNASDAQArray: [],
        // hold just the ticker values fetched from the json data sets
        allTickersFromNYSEArray: [],
        allTickersFromNASDAQArray: [],
        // bools to determine which data to display
        userSelectedNYSE: false,
        userSelectedNASDAQ: false,
    };

    useEffect(() => {
        fetchData();
    }, []);

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    // holds selection of whichever ticker was chosen
    const [selection, setSelection] = useState("");
    const autocompleteOnChange = (e, selectedOption) => {

        let findStockNameByTicker = "";

        if (state.userSelectedNYSE) {
            findStockNameByTicker = state.allDataFromNYSEArray.find(n => n.ticker == selectedOption);
        } else if (state.userSelectedNASDAQ) {
            findStockNameByTicker = state.allDataFromNASDAQArray.find(n => n.ticker == selectedOption);
        }

        if (selectedOption) {
            setSelection(`You selected ${JSON.stringify(findStockNameByTicker.name)}`)
        } else {
            setSelection("");
        }
    };


    const fetchData = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendMessageToSnackbar("Attempting to load data from server...");

            let fetchAllTickersFromNYSEResponse = await fetch(fetchAllTickersFromNYSEURL);
            let fetchAllTickersFromNYSEJson = await fetchAllTickersFromNYSEResponse.json();

            let fetAllTickersFromNASDAQResponse = await fetch(fetchAllTickersFromNASDAQURL);
            let fetchAllTickersFromNASDAQJson = await fetAllTickersFromNASDAQResponse.json();

            // testing
            // let response = await fetch(url);
            // let data = await response.json();
            // console.log(data["Time Series (Daily)"]['2022-03-23']['1. open']);

            sendMessageToSnackbar("Data loaded");

            setState({
                allDataFromNYSEArray: fetchAllTickersFromNYSEJson,
                allDataFromNASDAQArray: fetchAllTickersFromNASDAQJson,
                allTickersFromNYSEArray: fetchAllTickersFromNYSEJson.map((t) => t.ticker),
                allTickersFromNASDAQArray: fetchAllTickersFromNASDAQJson.map((t) => t.ticker),
            });

        } catch (error) {
            console.log(`error pulling data: ${error}`);
            sendMessageToSnackbar("Error pulling ticker data");
        }
    };

    // function to set states for each radio button
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
                        {selection}
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default FetchDataComponent;