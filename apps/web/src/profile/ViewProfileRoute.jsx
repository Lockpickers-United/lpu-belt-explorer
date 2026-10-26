import React, {useContext, useEffect} from 'react'
import AuthContext from '../app/AuthContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Tracker from '../app/Tracker'
import {useDocumentTitle} from 'usehooks-ts'
import {useNavigate} from 'react-router-dom'
import ProfileNotFound from './MustBeLoggedIn.jsx'
import LoadingDisplay from '../util/LoadingDisplay.jsx'

function ViewProfileRoute() {
    const {authLoaded, isLoggedIn, user} = useContext(AuthContext)
    const navigate = useNavigate()

    useDocumentTitle('LPU Belt Explorer - View Profile')

    useEffect(() => {
        if (authLoaded && user) {
            navigate(`/profile/${user.uid}`, {replace: true})
        }
    }, [authLoaded, navigate, user])

    return (
        <React.Fragment>
            <Nav title='View Profile'/>
            {!authLoaded && <LoadingDisplay/>}
            {authLoaded && !isLoggedIn && <ProfileNotFound/>}
            <Footer/>
            <Tracker feature='viewprofileredirect'/>
        </React.Fragment>
    )
}

export default ViewProfileRoute
