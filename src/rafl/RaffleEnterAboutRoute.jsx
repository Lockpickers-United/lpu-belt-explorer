import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleHeader from './RaffleHeader.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import RaffleInfoIntro from './RaffleInfoIntro.md?raw'
import RaffleInfoDetails from './RaffleInfoDetails.md?raw'
import Button from '@mui/material/Button'
import RaffleSubHead from './RaffleSubHead.jsx'
import {useNavigate} from 'react-router-dom'
import AdminToolsButton from './AdminToolsButton.jsx'
import RaffleNotLiveDialog from './RaffleNotLiveDialog.jsx'

function RaffleEnterAboutRoute() {

    usePageTitle('Enter the RAFL')
    const navigate = useNavigate()

    const {isMobile} = useWindowSize()
    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }
    const contentPadding = !isMobile ? '0px 20px' : '0px 10px'
    const linebreak = !isMobile ? ' ' : <br/>

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>

            <Nav title='Enter the RAFL' extras={extras}/>

            <div style={style}>
                <RaffleHeader page={'enter'}/>
                <RaffleSubHead text={'About the Raffle'}/>
            </div>


            <div style={{
                ...style,
                backgroundColor: '#222',
                minHeight: 72,
                alignItems: 'center',
                borderBottom: '1px #555 solid',
                padding: '20px 20px'
            }}>

                <div style={{padding: contentPadding}}>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {`${RaffleInfoIntro}`}
                    </ReactMarkdown>
                </div>


                <div style={{...style, textAlign: 'center', paddingTop: 20, paddingBottom: 20}}>

                    Once you&#39;ve read the rules and{linebreak}made your donation<br/><br/>

                    <Button variant='contained' color='success'
                            onClick={() => navigate('/rafl/entryform')}>
                        Click here to enter the RAFL
                    </Button>

                </div>

                <div style={style}>
                    <div style={{padding: contentPadding}}>
                        <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                            {`${RaffleInfoDetails}`}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            <div style={{height: 32}}/>

            <Footer/>
            <Tracker feature='raflEnterAbout'/>

            <RaffleNotLiveDialog/>

        </React.Fragment>
    )
}

export default RaffleEnterAboutRoute
