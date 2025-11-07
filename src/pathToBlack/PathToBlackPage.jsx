import React, {} from 'react'
import PathToBlack from './PathToBlack.jsx'
import {pageData} from './pageData'
import {useLocation, useNavigate} from 'react-router-dom'
import queryString from 'query-string'
import Link from '@mui/material/Link'

export default function PathToBlackPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const {pageId} = queryString.parse(location.search)
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '6px 20px',
        borderRadius: 0
    }

    const linkSx = {
        color: '#eee', textDecoration: 'underline', cursor: 'pointer', '&:hover': {
            color: '#fff',
            textDecoration: 'underline'
        }
    }

    return (
        <div style={{
            margin: 8,
            paddingBottom: 32,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 16,
            marginBottom: 16
        }}>

            {!pageData[pageId] &&
                <React.Fragment>
                    <div style={style}>
                        <div style={{marginBottom: 24}}>
                            We&#39;ve asked advanced pickers to share their view of a &#34;Path to Black&#34;,
                            tracing the steps of rising through the LPU Belt Rankings.
                            Some have shared the actual locks they submitted along the way
                            while other have taken the opportunity to explore options around a specific theme.
                            Most include an array of recommendations for each belt.
                        </div>

                        {Object.keys(pageData).map(pageId => (
                            <div key={pageId} style={{marginTop: 16, maxWidth: 650}}>
                                <Link onClick={() => {
                                    navigate(`/pathtoblack?pageId=${pageId}`)
                                }}
                                      style={{
                                          fontWeight: 600,
                                          fontSize: '1.1rem',
                                      }}
                                      sx={linkSx}>
                                    {pageData[pageId].title}</Link><br/>
                                {pageData[pageId].description}
                            </div>
                        ))
                        }

                        <div style={{marginTop: 30, borderTop: '1px solid #fff', paddingTop: 16, fontSize: '0.95rem'}}>
                            A great source for higher-belt locks is the #lock-bazaar channel on the LPU discord.
                            You can browse/search/filter listings from most of the major sellers at: <Link
                            onClick={() => openInNewTab('https://lpulocks.com/#/lockbazaar')}
                            sx={linkSx}>lpulocks.com/#/lockbazaar</Link>
                        </div>

                    </div>
                </React.Fragment>
            }


            {pageData[pageId] &&
                <PathToBlack page={pageData[pageId]}/>
            }

        </div>
    )
}
