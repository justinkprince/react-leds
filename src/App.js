import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useDispatch, Provider } from "react-redux";

import store from "./store";
import { fetchConfig } from "./store/configSlice";
import theme from "./theme";
import Header from "./components/layout/Header";
import LedConsole from "./components/led-console";
import "./scss/main.scss";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(fetchConfig());
  }, [dispatch]);

  return <>{children}</>;
};

const App = () => {
  return (
    <>
      <Provider store={store}>
        <AppWrapper>
          <Router>
            <ThemeProvider theme={theme}>
              <Header />
              <CssBaseline />

              <Container maxWidth="xl">
                <Switch>
                  <Route path="/" exact>
                    <LedConsole />
                  </Route>
                </Switch>
              </Container>
            </ThemeProvider>
          </Router>
        </AppWrapper>
      </Provider>
    </>
  );
};

export default App;
