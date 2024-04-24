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
        window.location.reload()
    }, [])

    return (
        <React.Fragment>
            <Nav title='Something went wrong...'/>

            <Card style={{maxWidth: 350, marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
                <CardHeader title='Oops'/>
                <CardContent>
                    An unexpected error occurred. Sorry about that. Please reload the page.
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
