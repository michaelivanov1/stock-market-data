import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import {
    Card,
    CardHeader,
} from "@mui/material";
import "../App.css";

const HomeComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <Card style={{ marginTop: "10%" }}>
                <CardHeader
                    style={{ color: theme.palette.primary.main, textAlign: "center" }}
                    title="will add homescreen eventually"
                />
            </Card>
        </ThemeProvider>
    );
};

export default HomeComponent;