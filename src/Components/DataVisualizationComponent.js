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

import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const DataVisualizationComponent = () => {

    let yesterday = new Date(Date.now() - 86400000); // 24 * 60 * 60 * 1000

    const [date, setDate] = useState([
        {
            startDate: new Date(yesterday),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const options = {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        animationEnabled: true,
        exportEnabled: true,
        title: {
            // text: "Intel Corporation Stock Price -  2017"
        },
        axisX: {
            valueFormatString: "MMM"
        },
        axisY: {
            includeZero: false,
            prefix: "$",
            title: "Price (in USD)"
        },
        data: [{
            type: "candlestick",
            showInLegend: true,
            name: "Intel Corporation",
            yValueFormatString: "$###0.00",
            xValueFormatString: "MMMM YY",
            dataPoints: [

                // open, high, low, close
                { x: new Date(date[0].startDate), y: [12.70, 13.05, 12.57, 12.70] },
                { x: new Date(date[0].endDate), y: [12.95, 13.34, 12.48, 12.84] },
                // { x: new Date("2017-11-04"), y: [44.73, 47.64, 42.67, 46.16] },
                // { x: new Date("2017-11-05"), y: [44.73, 47.64, 42.67, 46.16] },
                // { x: new Date("2017-11-06"), y: [44.73, 47.64, 42.67, 46.16] },

            ]
        }
        ]
    }

    // console.log(`startDate: ${(moment(date[0].startDate).format("l"))}`);
    // console.log(`endDate: ${(moment(date[0].endDate).format("l"))}`);

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
                    onChange={item => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                />
                <Card style={{maxWidth: '50%', marginLeft: '25%'}}>
                    <div>
                        {/* <h1>React Candlestick Chart</h1> */}
                        <CanvasJSChart options={options}
                        /* onRef={ref => this.chart = ref} */
                        />
                        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                    </div>
                </Card>


            </Box>
        </ThemeProvider>
    );

}

export default DataVisualizationComponent;