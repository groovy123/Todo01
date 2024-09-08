import "./App.css";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MainPage } from "./components/MainPage";

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
