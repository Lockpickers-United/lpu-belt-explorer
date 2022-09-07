import React from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'
import Belts from './Belts'
import Nav from './Nav'

const darkTheme = createTheme({
    // https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=000000&secondary.color=49ff00
    palette: {
        mode: 'dark',
        primary: {
            main: '#000000',
            light: '#2c2c2c',
            dark: '#000000',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#49ff00',
            light: '#8cff56',
            dark: '#00ca00',
            contrastText: '#000000'
        }
    }
})

function Root() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>

            <App/>
        </ThemeProvider>
    )
}

export default Root
