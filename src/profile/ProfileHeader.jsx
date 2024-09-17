import React, {useCallback} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import CopyProfileLinkButton from './CopyProfileLinkButton.jsx'
import Link from '@mui/material/Link'

export default function ProfileHeader({profile = {}, page, owner, mostPopular}) {
    const {userId} = useParams()
    const navigate = useNavigate()

    const profileName = profile['privacyAnonymous'] || !profile?.displayName
        ? 'anonymous'
        : profile?.displayName

    const safeName = profileName.replace(/\s/g, '_')

    const profileLink = '/profile/' + userId + '?name=' + safeName
    const safelocksLink = '/profile/' + userId + '/safelocks?name=' + safeName
    const scorecardLink = '/profile/' + userId + '/scorecard?name=' + safeName

    let pageName = page.charAt(0).toUpperCase() + page.slice(1)
    pageName = pageName.replace('Safelocks', 'Safe Locks')

    const handleClick = useCallback((link) => {
        navigate(link)
    }, [navigate])

    const ownerName = profile.displayName && !profile['privacyAnonymous']
        ? profile.displayName.toLowerCase().endsWith('s')
            ? `${profile.displayName}'`
            : `${profile.displayName}'s`
        : owner && !profile['privacyAnonymous']
            ? 'No Name'
            : 'Anonymous'

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
        <React.Fragment>
            <div style={style}>
                <div style={{marginTop: 6, display: 'flex'}}>
                    <div>{title}</div>
                    <div style={{marginTop: -2}}><CopyProfileLinkButton page={page} safeName={safeName} mostPopular={mostPopular}/></div>
                </div>
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
                            Locks
                        </ToggleButton>

                        <ToggleButton onClick={() => handleClick(safelocksLink)}
                                      selected={page === 'safelocks'}
                                      disabled={page === 'safelocks'}
                                      value='safelocks'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            Safes
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
            {!profile['privacyAnonymous'] && !profile?.displayName && owner &&
                <div style={{backgroundColor: '#202020', padding: '0px 0px 20px 16px'}}>
                    Looks like you haven&#39;t set your Display Name yet. To set it now, <Link
                    onClick={() => navigate('/profile/edit')} style={{color: '#0a0'}}>click here.</Link>
                </div>
            }
        </React.Fragment>
    )

}