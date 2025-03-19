import React, {useContext, useCallback} from 'react'
import useData from '../util/useData.jsx'
import Nav from '../nav/Nav.jsx'
import Footer from '../nav/Footer.jsx'
import Tracker from '../app/Tracker.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import ContentSubmit from './ContentSubmit.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import SignInButton from '../auth/SignInButton.jsx'
import Button from '@mui/material/Button'
import IntroCopy from '../misc/IntroCopy.jsx'
import usePageTitle from '../util/usePageTitle.jsx'

function ContentRoute() {
    const {user} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    usePageTitle('LPU Belt Explorer - Submit Photos')

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
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Submit Photos' extras={nav}/>

            {(data && !data.photoCredit) || !user &&
                <div style={{marginTop: 20, padding: '0px 0px'}}>
                    <IntroCopy pageName={'photoUpload'} maxWidth={820}/>
                </div>
            }
            {loading && <LoadingDisplay/>}

            {!loading && data && !error &&
                <ContentSubmit profile={data}/>
            }

            {!loading && !data && !error && !user &&
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
            <Tracker feature='uploadPhotos'/>
        </React.Fragment>
    )
}

export default ContentRoute