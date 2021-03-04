import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "./theme";
import Header from "./components/layout/Header";
import LedConsole from "./components/led-console";
import "./scss/main.scss";

const App = () => {
  return (
    <>
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
    </>
  );
};

export default App;
