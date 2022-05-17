import React, { useReducer } from "react";
import { Route, Link, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import HomeComponent from "./Components/StockMarket/HomeComponent";
import SearchIndividualStocksComponent from "./Components/StockMarket/SearchIndividualStocksComponent";
import SearchETFSComponent from "./Components/StockMarket/SearchETFSComponent";
import DataVisualizationComponent from "./Components/StockMarket/DataVisualizationComponent";
import CryptoComponent from "./Components/Crypto/CryptoComponent";

import {
  Toolbar,
  AppBar,
  Typography,
  Snackbar,
} from "@mui/material";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from "@mui/material/ListSubheader";
import Divider from '@mui/material/Divider';

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

  // fetch data from child components and use it in snackbar
  const dataFromChild = (msg) => {
    setState({ snackbarMsg: msg, gotData: true });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar style={{ position: 'sticky', background: 'white', width: '100%', boxShadow: 'none', borderBottom: '1px solid black', marginBottom: 30 }}>
        <Toolbar>
          <Typography variant="h4" color="black" align="center" width="100%">
            Stock Market Data Visualizer
          </Typography>
        </Toolbar>
      </AppBar>

      {/* bgcolor: 'background.paper' */}
      <Box sx={styles.boxStyles}>
        <List direction="column">
          {/* optional: can add disablePadding property on ListItem */}
          <ListItem>
            <ListItemButton component={Link} to="/home">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListSubheader>Search methods</ListSubheader>
          <ListItem>
            <ListItemButton component={Link} to="/searchstocks">
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search Individual Stocks" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton component={Link} to="/searchetfs">
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search ETFs" />
            </ListItemButton>
          </ListItem>
          <ListSubheader>Data visualization with graphs <b>*In progress*</b></ListSubheader>
          <Divider />
          <ListItem>
            <ListItemButton component={Link} to="/datavisualization">
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Data Visualization" />
            </ListItemButton>
          </ListItem>
          <ListSubheader>Crypto</ListSubheader>
          <Divider />
          <ListItem>
            <ListItemButton component={Link} to="/crypto">
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Crypto" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <div>
        <Routes>
          <Route path="/" element={<HomeComponent dataFromChild={dataFromChild} />} />
          <Route path="/home" element={<HomeComponent dataFromChild={dataFromChild} />} />
          <Route path="/searchstocks" element={<SearchIndividualStocksComponent dataFromChild={dataFromChild} />} />
          <Route path="/searchetfs" element={<SearchETFSComponent dataFromChild={dataFromChild} />} />
          <Route path="/datavisualization" element={<DataVisualizationComponent dataFromChild={dataFromChild} />} />
          <Route path="/crypto" element={<CryptoComponent dataFromChild={dataFromChild} />} />
        </Routes>
      </div>
      <Snackbar
        open={state.gotData}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />
      <Toolbar style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        right: 0,
        borderTop: '1px solid black',
        backgroundColor: 'white',
      }}>
        <Typography style={{ textAlign: 'center', flexGrow: '1', fontSize: '20px' }}>Michael Ivanov - {new Date().getFullYear()}</Typography>
      </Toolbar>
    </ThemeProvider>
  );
};

const styles = {
  boxStyles: {
    maxWidth: '20%',
    position: 'absolute',
    paddingBottom: '60px',

    "@media (max-width: 850px)": {
      maxWidth: '100%',
      position: 'relative',
    }
  }
}

export default App;