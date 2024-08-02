import React, {useCallback} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'

export default function ProfileHeader({profile = {}, page}) {
    const {userId} = useParams()
    const navigate = useNavigate()

    const profileLink = '/profile/' + userId + '?name=' + profile.displayName
    const scorecardLink = '/profile/' + userId + '/scorecard?name=' + profile.displayName
    const pageName = page.charAt(0).toUpperCase() + page.slice(1)

    const handleClick = useCallback((link) => {
        navigate(link)
    }, [navigate])

    const ownerName = profile.displayName
        ? profile.displayName.toLowerCase().endsWith('s')
            ? `${profile.displayName}'`
            : `${profile.displayName}'s`
        : 'Private'

    const title = userId
        ? `${ownerName} ${pageName}`
        : 'My ' + pageName

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 0,
            display: 'block',
            padding: 16,
            fontSize: '1.5rem',
            backgroundColor: '#202020',
            width: '100%'
        }
        : {
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 0,
            display: 'flex',
            padding: 16,
            fontSize: '1.5rem',
            backgroundColor: '#202020',
            width: '100%'
        }

    return (

        <div style={style}>
            <div style={{marginTop: 6}}>{title}</div>
            <div style={{flexGrow: 1, textAlign: 'right'}}>
                <ToggleButtonGroup
                    variant='outlined'
                    size='large'
                >
                    <ToggleButton onClick={() => handleClick(profileLink)}
                                  selected={page === 'collection'}
                                  disabled={page === 'collection'}
                                  value='collection'
                                  style={{padding: '2px 12px 2px 12px'}}>
                        Lock Collection
                    </ToggleButton>

                    <ToggleButton onClick={() => handleClick(scorecardLink)}
                                  selected={page === 'scorecard'}
                                  disabled={page === 'scorecard'}
                                  value='scorecard'
                                  style={{padding: '2px 12px 2px 12px'}}>
                        Scorecard
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        </div>

    )

}