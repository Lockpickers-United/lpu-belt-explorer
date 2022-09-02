import React from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import Nav from './Nav'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    }
})

function Root() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Nav/>
            <App/>
        </ThemeProvider>
    )
}

export default Root
