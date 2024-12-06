import React, {useContext, useCallback} from 'react'
import useData from '../util/useData.jsx'
import Nav from '../nav/Nav.jsx'
import Footer from '../nav/Footer.jsx'
import Tracker from '../app/Tracker.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import FlickrInfoSubmit from './FlickrInfoSubmit.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import SignInButton from '../auth/SignInButton.jsx'
import Button from '@mui/material/Button'

function ToolsRoute() {
    const {user} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    document.title = 'LPU Belt Explorer - Tools'

    const userId = user ? user.uid : null
    const loadFn = useCallback(async () => {
        if (!userId) return null
        try {
            return await getProfile(userId)
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])
    const {data = {}, loading, error} = useData({loadFn})

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Tools' extras={nav}/>
            {loading && <LoadingDisplay/>}

            {!loading && data && !error &&
                <FlickrInfoSubmit profile={data}/>
            }

            {!loading && !data && !error &&
                <div style={{
                    maxWidth: 700, padding: 0,
                    marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46
                }}>
                    <div style={{textAlign: 'center', marginTop: 40}}>
                        We&#39;re sorry, you must be signed in to submit content.
                        <br/><br/>
                        <Button style={{color: '#fff'}}>
                            <SignInButton/>
                        </Button>
                    </div>
                </div>
            }
            <Footer/>
            <Tracker feature='flickrInfo'/>
        </React.Fragment>
    )
}

export default ToolsRoute