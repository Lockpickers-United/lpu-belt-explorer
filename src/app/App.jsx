import React from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {FilterProvider} from '../contexts/FilterContext'
import {StorageProvider} from '../contexts/StorageContext'
import {DataProvider} from '../contexts/DataContext'
import {AppProvider} from '../contexts/AppContext'
import Nav from '../nav/Nav'
import Entries from '../entries/Entries'
import Footer from '../nav/Footer'
import {HelmetProvider} from 'react-helmet-async'

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

function App() {
    const style = getRootStyle(darkTheme)
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <style>{style}</style>

            <StorageProvider>
                <FilterProvider>
                    <DataProvider>
                        <AppProvider>
                            <HelmetProvider>
                                <Nav/>

                                <Entries/>

                                <Footer/>
                            </HelmetProvider>
                        </AppProvider>
                    </DataProvider>
                </FilterProvider>
            </StorageProvider>
        </ThemeProvider>
    )
}

const getRootStyle = styleTheme => {
    const linkTextColor = styleTheme.palette.text.icon
    const backgroundColor = styleTheme.palette.background.default

    return `
            body {
                background-color: ${backgroundColor};
                margin: 0;
                padding: 0;
            }
            
            a {
                color: ${linkTextColor};
            }
            
            pre{ 
                white-space: pre-wrap; 
                word-break: break-word;
            }
            
            :root {
              color-scheme: dark;
              overflow-y: scroll;
            }
        `
}

export default App
