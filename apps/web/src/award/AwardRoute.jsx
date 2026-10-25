import React, {useContext} from 'react'
import Nav from '../nav/Nav.jsx'
import Footer from '../nav/Footer.jsx'
import Tracker from '../app/Tracker.jsx'
import DBContext from '../app/DBContext.jsx'
import Award from './Award.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import ProfileNotFound from '../profile/ProfileNotFound.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'

function AwardRoute() {
    const {dbLoaded, lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()
    usePageTitle('Black Belt Certificate')

    const isBlackBelt = !!lockCollection.blackBeltAwardedAt

    const nav = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Congratulations!' extras={nav}/>
            {!dbLoaded && <LoadingDisplay/>}
            {dbLoaded && isBlackBelt &&
                <Award profile={lockCollection}/>
            }
            {dbLoaded && !isBlackBelt && <ProfileNotFound/>}
            <Footer/>
            <Tracker feature='award'/>
        </React.Fragment>
    )
}

export default AwardRoute