import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React, {useCallback} from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Tracker from './Tracker'

function ErrorFallback() {
    const handleClick = useCallback(() => {
        location.reload()
    }, [])

    return (
        <React.Fragment>
            <Nav title='Something went awry.'/>

            <Card style={{maxWidth: 350, marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
                <CardHeader title='Site updated.'/>
                <CardContent>
                    A new version of the site has been published! Please reload the page for the latest update.
                </CardContent>
                <CardActions>
                    <Button onClick={handleClick} color='secondary'>Reload</Button>
                </CardActions>
            </Card>

            <Footer/>

            <Tracker feature='error'/>
        </React.Fragment>
    )
}

export default ErrorFallback
