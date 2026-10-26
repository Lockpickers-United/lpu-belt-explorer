import React, {useCallback, useEffect, useState} from 'react'
import Collapse from '@mui/material/Collapse'
import EntryVideos from './EntryVideos.jsx'
import IconButton from '@mui/material/IconButton'
import {useAccess} from '../app/AccessContext.jsx'
import EntryClassificationVote from '../classification/EntryClassificationVote.jsx'
import {useTheme} from '@mui/material'
import ClassificationAdminButton from '../classification/ClassificationAdminButton.jsx'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import BiotechIcon from '@mui/icons-material/Biotech'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'
import EntryClassificationAdmin from '../classification/EntryClassificationAdmin.jsx'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import UserClassificationButton from '../classification/UserClassificationButton.jsx'
import CopyEntryTextButtonAdmin from './CopyEntryTextButtonAdmin.jsx'
import {useMatches} from 'react-router-dom'

const roleDisplay = {
    admin: {
        icon: OfflineBoltIcon,
        color: 'success'
    },
    lpuMod: {
        icon: SportsMartialArtsIcon,
        color: 'warning'
    },
    qaUser: {
        icon: BiotechIcon,
        color: 'info'
    }
}

export default function EntryActionBar({entry, style = {}, openAdminForm=true, entryRef}) {
    const {accessInfo} = useAccess()
    const isClassification = useMatches().some(match => match.handle?.route === 'classification')
    const theme = useTheme()

    const defaultFeature = openAdminForm && accessInfo.features.classificationAdmin
        ? 'classificationAdmin'
        : 'classification'

    const [showFeature, setShowFeature] = useState(isClassification ? {[defaultFeature]: true} : {})

    useEffect(() => {
        if (isClassification && openAdminForm && accessInfo.features.classificationAdmin) {
            setShowFeature({classificationAdmin: true})
        }
    }, [accessInfo.features.classificationAdmin, isClassification, openAdminForm])

    const handleToggle = useCallback((feature) => {
        setShowFeature(current => current[feature] ? {} : {[feature]: true})
    }, [])

    if (!accessInfo.features.entryActionBar) return null

    const currentRole = accessInfo?.activeRole
        ? accessInfo?.activeRole
        : accessInfo?.roles?.lpuMod
            ? 'lpuMod'
            : null

    const Icon = currentRole
        ? roleDisplay[currentRole]?.icon
        : null

    // TODO: get adminActions & user votes only @ Lock context for buttons

    return (
        <div style={{
            margin: '0px 0px 0px 0px',
            backgroundColor: '#2c2c2c',
            padding: '2px 10px',
            border: '1px solid #666',
            borderRadius: '6px',
            ...style
        }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexGrow: 1, alignItems: 'center'}}>
                    {roleDisplay[currentRole]?.icon
                        ? <Icon style={{color: theme.palette[roleDisplay[currentRole]?.color]?.main}}/>
                        : null}
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end'}}>

                    {accessInfo.features.classificationAdmin &&
                        <ClassificationAdminButton
                            entry={entry}
                            style={{marginRight: '10px'}}
                            handleToggle={() => handleToggle('classificationAdmin')}/>
                    }
                    {accessInfo.features.classificationVote &&
                        <UserClassificationButton
                            entry={entry}
                            handleToggle={() => handleToggle('classification')}/>
                    }
                    {accessInfo.features.scorecardVideos &&
                        <IconButton onClick={() => handleToggle('videos')} style={{marginRight: '10px'}}>
                            <SmartDisplayIcon style={{color: showFeature.videos ? '#fff' : '#ccc'}}/>
                        </IconButton>
                    }
                    <CopyEntryTextButtonAdmin entry={entry}/>
                </div>
            </div>
            <Collapse in={showFeature.videos}>
                {showFeature.videos &&
                    <div style={{margin: '6px 0px 20px 0px'}}>
                        <EntryVideos entry={entry}/>
                    </div>
                }
            </Collapse>
            <Collapse in={showFeature.classification}>
                {showFeature.classification &&
                    <div style={{margin: '6px 0px 20px 0px'}}>
                        <EntryClassificationVote entry={entry} entryRef={entryRef}/>
                    </div>
                }
            </Collapse>
            <Collapse in={showFeature.classificationAdmin}>
                {showFeature.classificationAdmin &&
                    <div style={{margin: '6px 0px 20px 0px'}}>
                        <EntryClassificationAdmin entry={entry}
                                                  handleToggle={() => handleToggle('classificationAdmin')}
                                                  entryRef={entryRef}/>
                    </div>
                }
            </Collapse>
        </div>
    )
}
