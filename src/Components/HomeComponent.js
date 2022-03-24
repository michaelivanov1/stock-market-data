import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import {
    AppBar,
    Card,
    CardHeader,
} from "@mui/material";
import "../App.css";

const HomeComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">

            </AppBar>
            <Card style={{ marginTop: "10%" }}>
                <CardHeader
                    style={{ color: theme.palette.primary.main, textAlign: "center" }}
                    title="will implement eventually"
                />
            </Card>
        </ThemeProvider>
    );
};

export default HomeComponent;