import React, { useState, useReducer } from "react";
import { Route, Link, Routes } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomeComponent from "./Components/HomeComponent";
import FetchDataComponent from "./Components/FetchDataComponent";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";

const App = () => {


  const initialState = {
    snackBarMsg: "",
    gotData: false,
  }

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ gotData: false });
  };

  const dataFromChild = (msg) => {
    setState({ snackbarMsg: msg, gotData: true });
  };

  const [anchorEl, setAnchorEl] = useState(null);



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Stock Market API
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/home">
              Home
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/main">
              Fetch Data
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Routes>
          <Route path="/" element={<HomeComponent dataFromChild={dataFromChild} />} />
          <Route path="/home" element={<HomeComponent dataFromChild={dataFromChild} />} />
          <Route path="/main" element={<FetchDataComponent dataFromChild={dataFromChild} />} />
        </Routes>
      </div>
      <Snackbar
        open={state.gotData}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />
    </ThemeProvider>
  );
};
export default App;

