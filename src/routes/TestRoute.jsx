import React from 'react'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'

function TestRoute() {
    return (
        <React.Fragment>
            <Nav/>

            <AppBar position='relative' style={{boxShadow: 'none'}}>
                <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
                    Some Header IDK
                </Typography>
            </AppBar>

            <Card style={{margin: 16, maxWidth: 250}}>
                <CardHeader title='Some Title IDK'/>
                <CardContent>
                    Testing 123
                </CardContent>
                <CardActions>
                    <Button color='secondary'>Action</Button>
                </CardActions>
            </Card>

            <Footer/>
        </React.Fragment>
    )
}

export default TestRoute
