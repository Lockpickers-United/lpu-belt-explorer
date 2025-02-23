import React, {useState, useMemo, useContext, useCallback} from 'react'
import Button from '@mui/material/Button'
import ScorecardRow from './ScorecardRow.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import ScorecardListContext from './ScorecardListContext'
import FilterContext from '../context/FilterContext'
import useWindowSize from '../util/useWindowSize.jsx'
import {getAwardEntryFromId} from '../entries/entryutils'
import dayjs from 'dayjs'
import usePageTitle from '../util/usePageTitle.jsx'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'

function ImportPreviewDisplay({profile, importResults, service}) {
    usePageTitle('Import Results')
    const {isMobile} = useWindowSize()
    const navigate = useNavigate()

    const {cardActivity = []} = useContext(ScorecardDataContext)
    const serviceAwards = useMemo(() => {
        const re = service === 'Reddit'
            ? /reddit.com/i
            : /discord.com/i
        return cardActivity
            .filter(act => act.collectionDB === 'awards' && re.test(act.link))
            .map(act => {
                return {...act, ...getAwardEntryFromId(act.matchId)}
            })
    }, [cardActivity, service])

    const awards = importResults?.awards
        ? importResults?.awards?.map(msg => {
            return {
                ...msg,
                ...getAwardEntryFromId(msg.matchId),
                date: dayjs(msg.awardedAt).format()
            }
        }).sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
        : []

    const awardsLookup = awards.reduce((acc, award) => {
        acc[award.matchId] = award
        return acc
    }, {})

    const previousAwards = serviceAwards.filter(award => !awardsLookup[award.matchId])
    const descriptor = previousAwards.length > 0 ? 'new ' : ''

    const {expanded} = useContext(ScorecardListContext)
    const {filters, removeFilters} = useContext(FilterContext)

    const [entryExpanded, setEntryExpanded] = useState(expanded)

    if (expanded && expanded !== entryExpanded) {
        setEntryExpanded(expanded)
    }

    const handleLink = useCallback(() => {
        // MESSY: remove extra params from URL, like http://localhost:3000/?state=a2f4kr9zlk&code=E4VxekjpTxZzDbrpf8iSzCXXQrJBJw#_
        window.location = window.location.origin + '/#/profile/scorecard'
    }, [])

    const handleProfileLink = useCallback(() => {
        navigate('/profile/edit')
    },[navigate])


        const handleEntryExpand = useCallback((expand) => {
        if (filters['id']) {
            removeFilters(['id'])
        }
        setEntryExpanded(expand)
    }, [filters, removeFilters])

    const flexStyle = isMobile ? 'block' : 'flex'
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display: flexStyle, padding: '16px 16px'}}>
                <div style={{fontSize: '1.5rem', flexGrow: 1}}>{service} Import Results</div>
                <div style={{padding: 16}}>
                    <Button
                        variant='contained'
                        color='secondary'
                        style={{lineHeight: '1.2rem'}}
                        onClick={() => handleLink()}
                    >VIEW SCORECARD</Button>
                </div>
            </div>

            <div style={{fontSize: '1rem', padding: '0px 16px'}}>
                {awards.length > 0 &&
                    <strong>Congratulations {importResults.username}! </strong>
                }
                Here are your rankings from {service}.
                <div style={{height: 8}}/>

                {service === 'Discord' &&
                    <span>
                        Your approved rankings will be updated automatically as long as
                        you have your Discord username in your Profile.

                        You can remove it at any time
                        in <Link onClick={() => handleProfileLink()} style={{color:'#d9d9ff'}}>Edit Profile</Link>.

                        If you have more than one Discord username,
                        please run the import under both names to get all of your rankings.
                    </span>
                }

                {service === 'Reddit' &&
                    <span>

                       You&#39;ll need to import again to pick up new belts once they have been approved
                        and you&#39;ve been flagged on Reddit.

                        We save your username and it will never be shown to other users.

                        You can remove it at any time
                        in <Link onClick={() => handleProfileLink()} style={{color:'#d9d9ff'}}>Edit Profile</Link>.

                    </span>
                }

                <div style={{margin:'20px 0px'}}>
                    If you have an approved belt that is not showing up here,
                    reach out to us in #belt-explorer on the LPU Discord server for help.
                    Mods and #belt-requests are a different team who won&#39;t be able to help.</div>

                <div style={{height: 16}}/>
            </div>
            <div style={{height: 8, backgroundColor: '#000'}}/>

            <React.Fragment>
                {awards?.length === 0 &&
                    <div style={{padding: 16, fontWeight: 700, fontSize: '1.2rem'}}>No {descriptor}approved belts
                        found</div>
                }
                {awards?.length > 0 &&
                    <div>
                        {service === 'Reddit' &&
                            <div style={{padding: 16, fontWeight: 700, fontSize: '1.2rem'}}>New Belts</div>
                        }
                        {awards?.map(act =>
                            <ScorecardRow key={act.id}
                                          owner={true}
                                          activity={act}
                                          expanded={act.id === entryExpanded}
                                          onExpand={handleEntryExpand}
                                          merged={profile.blackBeltAwardedAt > 0}
                            />
                        )}
                    </div>
                }

                <div style={{height: 8, backgroundColor: '#000'}}/>

                {previousAwards.length > 0 &&
                    <div style={{}}>
                        <div style={{padding: 16, fontWeight: 700, fontSize: '1.2rem'}}>Existing Belts</div>
                        {previousAwards?.map(act =>
                            <ScorecardRow key={act.id}
                                          owner={true}
                                          activity={act}
                                          expanded={act.id === entryExpanded}
                                          onExpand={handleEntryExpand}
                                          merged={profile.blackBeltAwardedAt > 0}
                            />
                        )}
                    </div>
                }

            </React.Fragment>

        </div>
    )
}

export default ImportPreviewDisplay
