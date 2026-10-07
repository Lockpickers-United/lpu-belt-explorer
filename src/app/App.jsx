import React from 'react'
import {SnackbarProvider} from 'notistack'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {AppProvider} from './AppContext'
import AppRoutes from './AppRoutes'
import {AuthProvider} from './AuthContext'
import {DBProvider} from './DBContext'
import {ScoringProvider} from '../context/ScoringContext.jsx'
import initializeLocales from '../util/datetime'
import {SystemMessageProvider} from '../systemMessage/SystemMessageContext.jsx'
import {APIProvider} from './APIContext.jsx'
import {AccessProvider} from './AccessContext.jsx'
import {darkTheme} from './Theme.jsx'

initializeLocales()

function App() {
    const style = getRootStyle(darkTheme)
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <style>{style}</style>

            <SnackbarProvider autoHideDuration={3000}>
                <AuthProvider>
                    <AccessProvider>
                        <DBProvider>
                            <APIProvider>
                                <AppProvider>
                                    <SystemMessageProvider>
                                        <ScoringProvider>
                                            <AppRoutes/>
                                        </ScoringProvider>
                                    </SystemMessageProvider>
                                </AppProvider>
                            </APIProvider>
                        </DBProvider>
                    </AccessProvider>
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
