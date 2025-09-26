import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleHeader from './RaffleHeader.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import RaffleAnnounce from './RaffleAnnounce.md?raw'
import RaffleSubHead from './RaffleSubHead.jsx'
import AdminToolsButton from './AdminToolsButton.jsx'

function RaffleAnnouncetRoute() {

    usePageTitle('Call for Prize Contributions')

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

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
        </React.Fragment>
    )

    const navTitle = !isMobile ? 'Announcing RAFL 2026!' : 'RAFL 2026!'

    return (
        <React.Fragment>

            <Nav title={navTitle} extras={extras}/>

            <div style={style}>
                <RaffleHeader page={'announce'}/>
                <RaffleSubHead text={'Call for Prize Contributions'}/>
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
                        {`${RaffleAnnounce}`}
                    </ReactMarkdown>
                </div>
            </div>

            <div style={{height: 32}}/>

            <Footer/>
            <Tracker feature='raflAnnounce'/>

        </React.Fragment>
    )
}

export default RaffleAnnouncetRoute
