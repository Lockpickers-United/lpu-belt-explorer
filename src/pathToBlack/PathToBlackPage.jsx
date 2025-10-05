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

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '6px 20px',
        borderRadius: 0
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
                    <div style={{
                        ...style,
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        padding: '8px 0 0 18px'
                    }}>
                        Path to Black
                    </div>
                    <div style={style}>
                        We&#39;ve asked advanced pickers to share their view of a &#34;Path to Black&#34;,
                        tracing the steps of rising through the LPU Belt Rankings.
                        Some have shared the actual locks they submitted along the way
                        while other have taken the opportunity to explore options around a specific theme.
                        Most include an array of recommendations for each belt.

                        {Object.keys(pageData).map(pageId => (
                            <div key={pageId} style={{marginTop: 16}}>
                                <Link onClick={() => {
                                    navigate(`/pathtoblack?pageId=${pageId}`)
                                }}
                                      style={{color: '#ccc', cursor: 'pointer', fontWeight:600, fontSize:'1.2rem'}}>
                                    {pageData[pageId].title}</Link><br/>
                                {pageData[pageId].description}
                            </div>
                        ))
                        }
                    </div>
                </React.Fragment>
            }


            {pageData[pageId] &&
                <PathToBlack page={pageData[pageId]} />
            }

        </div>
    )
}
