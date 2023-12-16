import React from 'react'
import {SnackbarProvider} from 'notistack'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {AuthProvider} from '../contexts/AuthContext'
import {DBProvider} from '../contexts/DBContext'
import {FilterProvider} from '../contexts/FilterContext'
import {LazyDataProvider} from '../contexts/LazyDataContext'
import {DataProvider} from '../contexts/DataContext'
import {AppProvider} from '../contexts/AppContext'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import routes from '../routes/routes'

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
                                        <RouterProvider router={router}/>
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

const router = createBrowserRouter(routes)

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
