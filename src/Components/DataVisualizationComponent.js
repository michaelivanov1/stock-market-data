import React, { useReducer, useEffect, useState } from "react";

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
import moment from "moment";

import theme from "../theme";


const DataVisualizationComponent = () => {

    let yesterday = new Date(Date.now() - 86400000); // 24 * 60 * 60 * 1000

    const [state, setState] = useState([
        {
            startDate: new Date(yesterday),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    console.log(`startDate: ${(moment(state[0].startDate).format("l"))}`);
    console.log(`endDate: ${(moment(state[0].endDate).format("l"))}`);

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center'>
                <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                    <CardHeader
                        title="TODO: add graphs"
                        style={{ color: 'black', textAlign: "center" }}
                    />
                </Card>

                <DateRange
                    editableDateInputs={true}
                    onChange={item => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                />

            </Box>
        </ThemeProvider>
    );

}

export default DataVisualizationComponent;