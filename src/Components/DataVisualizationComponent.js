import React, { useReducer, useEffect } from "react";
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

import theme from "../theme";


const DataVisualizationComponent = () => {

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center'>
                <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                    <CardHeader
                        title="TODO: add graphs and data visualization"
                        style={{ color: 'black', textAlign: "center" }}
                    />                
                </Card>
            </Box>
        </ThemeProvider>
    );

}

export default DataVisualizationComponent;