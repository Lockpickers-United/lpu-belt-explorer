import React, {useCallback, useContext, useMemo, useState} from 'react'
import ScorecardRow from '../ScorecardRow.jsx'
import ScorecardDataContext from '../ScorecardDataProvider'
import InlineScorecardCharts from '../InlineScorecardCharts'
import ScorecardDanStats from '../ScorecardDanStats.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import blackBelts from './blackBelts.json'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import {useSearchParams} from 'react-router-dom'
import AppContext from '../../app/AppContext.jsx'

function PreviewScorecard({owner, profile, tab, setTab}) {
    const {admin} = useContext(AppContext)
    const {isMobile} = useWindowSize()
    const headerDivStyle = isMobile ? 'block' : 'flex'
    const {visibleEntries = []} = useContext(ScorecardDataContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        searchParams.set('tab', event.target.value)
        setSearchParams(searchParams)
        setTab(event.target.value)
        handleClose()
    }, [handleClose, searchParams, setSearchParams, setTab])

    const blackBeltList = useMemo(() => {
        return Object.keys(blackBelts).reduce((acc, key) => {
            acc.push({'name': blackBelts[key], 'id': key})
            return acc
        }, [])
    }, [])

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>
            {admin &&
                <div style={{display: 'flex', padding: 20, marginBottom: 20, backgroundColor:'#800'}}>
                    <div style={{fontWeight: 700, fontSize: '1.5rem', marginRight: 20}}>ADMIN</div>
                    <div>
                        <FormControl style={{marginBottom: 10, minWidth: 200, textAlign: 'left'}} size='small'>
                            <InputLabel color='info'>Choose Tab</InputLabel>
                            <Select
                                value={tab}
                                name='Choose Tab '
                                label='Choose Tab '
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                onChange={handleChange}
                                style={{fontWeight: 400, color: '#eee'}}
                                color='info'
                            >
                                {blackBeltList.map((blackbelt, index) =>
                                    <MenuItem key={index} value={blackbelt.id}>{blackbelt.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            }

            {visibleEntries.length > 0 &&
                <React.Fragment>
                    {!isMobile
                        ? <div style={{display: headerDivStyle, padding: '30px 8px 0px 16px'}}>
                            <div style={{marginRight: 0, width: 380}}>
                                <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                            </div>
                            <div style={{flexGrow: 1, marginRight: 0}}>
                                <ScorecardDanStats/>
                            </div>
                        </div>
                        : <div style={{display: headerDivStyle, padding: '20px 8px 0px 16px'}}>
                            <ScorecardDanStats/>
                            <div style={{marginRight: 0, width: '95%'}}>
                                <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                            </div>
                        </div>
                    }
                </React.Fragment>
            }

            <div>
                {visibleEntries.map((act, index) =>
                    <ScorecardRow key={index}
                                  owner={owner}
                                  activity={act}
                                  expanded={false}
                                  onExpand={undefined}
                                  merged={false}
                    />
                )}
            </div>
        </div>
    )
}

export default PreviewScorecard
