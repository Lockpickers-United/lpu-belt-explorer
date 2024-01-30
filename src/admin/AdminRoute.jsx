import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import AdminMainPage from './CollectionsReportMain.jsx'

import {createTheme, ThemeProvider} from '@mui/material/styles'

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

function AdminRoute() {
    return (
        <ThemeProvider theme={lightTheme}>
            <style>{style}</style>

            <React.Fragment>
                <Nav title='Admin'/>
                <AdminMainPage/>
                <Footer/>
                <Tracker feature='admin'/>
            </React.Fragment>

        </ThemeProvider>

    )
}

export default AdminRoute
