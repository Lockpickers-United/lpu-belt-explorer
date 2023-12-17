import {SnackbarProvider} from 'notistack'
import React from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {AuthProvider} from '../contexts/AuthContext'
import {DBProvider} from '../contexts/DBContext'
import {FilterProvider} from '../contexts/FilterContext'
import {LazyDataProvider} from '../contexts/LazyDataContext'
import {DataProvider} from '../contexts/DataContext'
import {AppProvider} from '../contexts/AppContext'
import {LeaderboardProvider} from '../contexts/LeaderboardContext.jsx'
import Nav from '../nav/Nav'
import Entries from '../entries/Entries'
import EntriesCompact from '../entries/EntriesCompact'
import EntriesList from '../entries/EntriesList'
import Footer from '../nav/Footer'
import Leaderboard from "../profile/Leaderboard.jsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#000000',
            light: '#2c2c2c',
            dark: '#000000',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#18aa18',
            light: '#23d523',
            dark: '#117e11',
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

            <SnackbarProvider>
                <AuthProvider>
                    <DBProvider>
                        <LazyDataProvider>
                            <FilterProvider>
                                <DataProvider>
                                    <AppProvider>
                                        <Nav/>
                                        
                                        <EntriesList/>

                                        <Footer/>
                                    </AppProvider>
                                </DataProvider>
                            </FilterProvider>
                        </LazyDataProvider>
                    </DBProvider>
                </AuthProvider>
            </SnackbarProvider>
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
