import React, {useCallback, useState} from 'react'
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
import {ClassificationProvider} from '../app/ClassificationContext.jsx'
import CopyEntryTextButtonAdmin from './CopyEntryTextButtonAdmin.jsx'

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

export default function EntryActionBar({entry, isClassification, style = {}}) {
    const {accessInfo} = useAccess()
    const theme = useTheme()

    const [showFeature, setShowFeature] = useState(isClassification ? {classification: true} : {})

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
        <ClassificationProvider>
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
                                isClassification={isClassification}
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
                            <EntryClassificationVote entry={entry} isClassification={isClassification}/>
                        </div>
                    }
                </Collapse>
                <Collapse in={showFeature.classificationAdmin}>
                    {showFeature.classificationAdmin &&
                        <div style={{margin: '6px 0px 20px 0px'}}>
                            <EntryClassificationAdmin entry={entry} isClassification={isClassification}
                                                      handleToggle={() => handleToggle('classificationAdmin')}/>
                        </div>
                    }
                </Collapse>
            </div>
        </ClassificationProvider>
    )
}
