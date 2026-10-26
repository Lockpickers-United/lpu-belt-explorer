import {createTheme, ThemeProvider} from '@mui/material/styles'
import React from 'react'

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        text: {
            primary: '#333333',
            secondary: '#555555'
        }
    }
})

const getRootStyle = styleTheme => {
    const linkTextColor = styleTheme.palette.text.icon
    return `
            body {
                margin: 0;
                padding: 0;
                color: #333
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

const style = getRootStyle(lightTheme)

const LightTheme = ({children}) => {
    return (
        <ThemeProvider theme={lightTheme}>
            <style>{style}</style>

            {children}
        </ThemeProvider>
    )
}

export default LightTheme
