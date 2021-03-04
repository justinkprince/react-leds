import { createMuiTheme } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import blue from "@material-ui/core/colors/blue";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: grey[900],
    },
    secondary: {
      main: blue[700],
    },
  },
});

export default theme;
