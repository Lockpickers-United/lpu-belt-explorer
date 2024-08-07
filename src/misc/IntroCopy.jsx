import React from 'react'
import introCopyData from '../data/introCopy.json'
import {useNavigate} from 'react-router-dom'

export default function IntroCopy({pageName}) {
    const navigate = useNavigate()
    const intro = introCopyData[pageName]

    if (intro) {
        return (
            <div style={{maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: '0px 8px 20px 8px'}}>
                <strong>{intro.title}</strong><br/>
                {intro.copy}

                {intro.link && intro.destination &&
                    <React.Fragment>
                    &nbsp;<a onClick={() => {
                        navigate(intro.destination)
                    }} style={{cursor: 'pointer'}}>{intro.link}</a>
                    </React.Fragment>
                }
            </div>
        )
    }
}