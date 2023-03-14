import React from "react";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { SnackbarProvider } from "notistack";
import MyThemeProvider from "./theme/MyThemeProvider";

function App() {
  return (
    <MyThemeProvider>
      <SnackbarProvider>
        <AppRouter />
      </SnackbarProvider>
    </MyThemeProvider>
  );
}

export default App;
