import React from 'react'
import Nav from '../nav/Nav.jsx'
import Footer from '../nav/Footer.jsx'
import Tracker from '../app/Tracker.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import usePageTitle from '../util/usePageTitle.jsx'

function ToolsRoute() {
    const navigate = useNavigate()

    usePageTitle('Tools')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Tools' extras={nav}/>
            <div style={{
                maxWidth: 500, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46
            }}>
                <div style={{marginTop: 40}}>
                    <Link onClick={() =>navigate('/tools/flickrinfo')}
                          style={{color:'#fff', textDecorationColor:'#bbb', cursor:'pointer', fontSize:'1.1rem', fontWeight:700}}>
                        Get Flickr Media Info
                    </Link>
                </div>
                <div>
                    Retrieves photo data formatted for media tabs for a selected Flickr photoset by ID.
                </div>
            </div>
            <Footer/>
            <Tracker feature='flickrInfo'/>
        </React.Fragment>
    )
}

export default ToolsRoute