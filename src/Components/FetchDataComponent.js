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


const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=PLTR&interval=5min&apikey=8THF8YFBPG4UU0CT`;
//const url2 = `https://api.exchangerate-api.com/v4/latest/USD`;

const FetchDataComponent = (props) => {

    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
    }

    const initialState = {
        getTicker: [],
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const [selection, setSelection] = useState("");
    const onChange = (e, selectedOption) => {
        selectedOption
            ? setSelection(`You selected ${selectedOption}`)
            : setSelection("");
    };

    // this is to load data before the component renders 
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setState({
                contactServer: true,
                snackBarMsg: "Attempting to load data from server...",
            });

            let response = await fetch(url)
            let data = await response.json();

            // testing
            console.log(data["Time Series (Daily)"]['2022-03-23']['1. open']);

            sendMessageToSnackbar("Data loaded");

            setState({

                //getTicker: data.map((ticker) => ticker.rates),
                // getDateTest: data["Time Series (Daily)"]['2022-01-20'],
            });

        } catch (error) {
            console.log(`error pulling data: ${error}`);
            sendMessageToSnackbar("Data loaded");
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
                        options={state.getTicker}
                        getOptionLabel={(option) => option}
                        style={{ width: 300, margin: 'auto', color: theme.palette.primary.main }}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="choose ticker"
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