import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Autocomplete,
    TextField,
} from "@mui/material";
import theme from "../theme";


const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=PLTR&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`;
//const url2 = `https://api.exchangerate-api.com/v4/latest/USD`;

const fetchAllTickersFromNYSEURL = `https://raw.githubusercontent.com/michaelivanov1/stock-market-data/master/data-sets/all-nyse-tickers-2022.json`;

const FetchDataComponent = (props) => {

    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    const initialState = {
        allTickersFromNYSEArray: [],
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const [selection, setSelection] = useState("");
    const onChange = (e, selectedOption) => {
        selectedOption
            ? setSelection(`You selected ${selectedOption}`)
            : setSelection("");
    };

    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendMessageToSnackbar("Attempting to load data from server...");

            let fetchAllTickersFromNYSEResponse = await fetch(fetchAllTickersFromNYSEURL);
            let fetchAllTickersFromNYSEJson = await fetchAllTickersFromNYSEResponse.json();

            // testing
            let response = await fetch(url);
            let data = await response.json();
            console.log(data["Time Series (Daily)"]['2022-03-23']['1. open']);

            sendMessageToSnackbar("Data loaded");

            setState({
                allTickersFromNYSEArray: fetchAllTickersFromNYSEJson.map((ticker) => ticker.Symbol),
            });

        } catch (error) {
            console.log(`error pulling data: ${error}`);
            sendMessageToSnackbar("Error pulling ticker data");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Card style={{ marginTop: "10vh" }}>

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
                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.allTickersFromNYSEArray}
                        getOptionLabel={(option) => option}
                        style={{ width: 300, margin: 'auto', color: theme.palette.primary.main }}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="search by ticker"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    <p />
                    <Typography variant="h6" color="green" style={{ textAlign: 'center' }}>
                        {selection}
                    </Typography>
                </CardContent>
            </Card>          
        </ThemeProvider>
    );
};

export default FetchDataComponent;