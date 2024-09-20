import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import SignInButton from '../auth/SignInButton.jsx'

export default function ScorecardProfileNotFound() {
    const {isMobile} = useWindowSize()

    const flexStyle = !isMobile ? {display: 'flex'} : {display: 'block'}
    const headerStyle = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0,
        padding: 16,
        fontSize: '1.5rem',
        width: '100%'
    }

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>
            <div style={headerStyle}>
                Scorecard Not Found
            </div>

            <div style={{...flexStyle, paddingBottom:30}}>
                <div style={{padding: '0px 16px', flexGrow:1}}>
                    Scorecard is a new feature that lets you save locks you&#39;ve picked
                    with dates and links to videos/evidence.<br/><br/>

                    You must be logged in to
                    view your scorecard.

                    <div style={{marginLeft: 20, marginTop: 30}}><SignInButton/></div>
                </div>
                <div style={{paddingRight:16}}>
                    <img src='/images/scorecardSample.jpg' width='350px' alt='Scorecard Example'/>
                </div>
            </div>
        </div>
    )

}