import React, {useContext, useEffect} from 'react'
import AuthContext from '../app/AuthContext'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Footer from '../nav/Footer'
import LinearProgress from '@mui/material/LinearProgress'
import Nav from '../nav/Nav'
import Tracker from '../app/Tracker'
import Typography from '@mui/material/Typography'
import lpuLogoPath from '../resources/LPU.png'
import {useDocumentTitle} from 'usehooks-ts'
import {useNavigate} from 'react-router-dom'

function ViewProfileRoute() {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const navigate = useNavigate()

    useDocumentTitle('LPU Belt Explorer - View Profile')

    useEffect(() => {
        if (authLoaded && user) {
            navigate(`/profile/${user.uid}`)
        }
    }, [authLoaded, navigate, user])

    return (
        <React.Fragment>
            <Nav title='View Profile'/>
            {!authLoaded &&
                <React.Fragment>
                    <LinearProgress variant='indeterminate' color='secondary'/>
                    <img alt='Loading' src={lpuLogoPath} style={{
                        marginLeft: 'auto', marginRight: 'auto', display: 'block'
                    }}/>
                </React.Fragment>
            }
            {authLoaded && !isLoggedIn &&
                <Card style={{
                    marginTop: 16,
                    maxWidth: 350,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 0
                }}>
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
