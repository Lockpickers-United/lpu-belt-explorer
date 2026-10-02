import React, {useCallback, useContext, useState} from 'react'
import Collapse from '@mui/material/Collapse'
import EntryVideos from './EntryVideos.jsx'
import IconButton from '@mui/material/IconButton'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'
import {useAccess} from '../app/AccessContext.jsx'
import EntryClassification from './EntryClassification.jsx'
import BeltIcon from './BeltIcon.jsx'
import sampleData from '../data/classification-samples.json'
import AuthContext from '../app/AuthContext.jsx'

export default function EntryActionBar({entry}) {
    const {accessInfo} = useAccess()
    const {user = {}} = useContext(AuthContext)

    const [showFeature, setShowFeature] = useState({})
    const handleToggle = useCallback((feature) => {
        setShowFeature(current => current[feature] ? {} : {[feature]: true})
    }, [])

    // have separate JSON with just user votes so don't need to load everything?
    const classificationVotes = sampleData.filter(vote => vote.entryId === entry.id) || []
    const userVote = classificationVotes.find(vote => vote.userId === user.uid) || {}

    return (
        <div style={{
            margin: '0px 0px 0px 0px',
            backgroundColor: '#2c2c2c',
            padding: '8px',
            border: '1px solid #666',
            borderRadius: '6px'
        }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexGrow: 1, alignItems: 'center'}}>
                    {accessInfo.icon || null}
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}/>
                {accessInfo.enabledLevel > 90 &&
                    <IconButton onClick={() => handleToggle('classification')}
                                style={{marginRight: '10px', padding: '8px 4px'}}>
                        <BeltIcon value={userVote?.votedBelt || 'Unclassified'}
                                  text={userVote?.votedBelt ? undefined : '?'}
                                  related={true}
                                  containerStyle={{height: 24, width: 24}}
                                  style={{height: 24, width: 20, marginTop: -3}}
                                  rankStyle={{top: 3}}/>
                    </IconButton>
                }
                {accessInfo.enabledLevel >= 80 &&
                    <IconButton onClick={() => handleToggle('videos')} style={{marginRight: '10px'}}>
                        <SmartDisplayIcon style={{color: showFeature.videos ? '#fff' : '#ccc'}}/>
                    </IconButton>
                }
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
                        <EntryClassification entry={entry}/>
                    </div>
                }
            </Collapse>
        </div>

    )
}

