import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext, useEffect} from 'react'
import {useDocumentTitle} from 'usehooks-ts'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import lpuLogoPath from '../resources/LPU.png'
import {useNavigate} from 'react-router-dom'

import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

function ViewProfileRoute() {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const {dbLoaded} = useContext(DBContext)
    const navigate = useNavigate()

    useDocumentTitle('LPU Belt Explorer - View Profile')
    const nav = ''

    const style = {
        marginTop: 16,
        maxWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0
    }

    useEffect(() => {
        if (isLoggedIn && user) {
            navigate(`/profile/${user.uid}`)
        }
    }, [isLoggedIn, navigate, user])

    return (
        <React.Fragment>
            <Nav title='View Profile' extras={nav}/>

            {(!authLoaded || !dbLoaded) &&
                <React.Fragment>
                    <LinearProgress variant='indeterminate' color='secondary'/>
                    <img alt='Loading' src={lpuLogoPath} style={{
                        marginLeft: 'auto', marginRight: 'auto', display: 'block'
                    }}/>
                </React.Fragment>
            }

            {authLoaded && !isLoggedIn &&
                <Card style={style}>
                    <CardHeader title='Please Log In'/>
                    <CardContent>
                        <Typography variant='h6' align='center'>
                            You must be logged in to view your profile.
                        </Typography>
                    </CardContent>
                </Card>
            }

            <Footer/>
            <Tracker feature='viewprofileredirect'/>
        </React.Fragment>
    )
}

export default ViewProfileRoute
