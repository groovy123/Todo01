import "./App.css";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MainPage } from "./components/MainPage";
import dayjs from "dayjs";
import 'dayjs/locale/ja';

// dyajs plugins
dayjs.locale('ja');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="xl">
          <MainPage />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
