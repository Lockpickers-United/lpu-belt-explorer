import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {uniqueBelts} from '../../data/belts'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {Collapse, FormControl, InputLabel, Select, TableHead, TableRow} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import DataContext from '../../locks/LockDataProvider.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import ScorecardPick from './ScorecardPick.jsx'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import Link from '@mui/material/Link'
import ViewFilterButtons from '../../filters/ViewFilterButtons.jsx'
import {scorecardExploreSortFields} from '../../data/sortFields'
import TableCell from '@mui/material/TableCell'

export default function ScorecardLocks() {
    const {visibleEntries = []} = useContext(DataContext)
    const {filters, addFilter, removeFilters} = useContext(FilterContext)
    const {userBelt = 'All Belts', sort} = filters
    
    const [showMore, setShowMore] = useState(sort)

    useEffect(() => {
        setShowMore(!!sort)
    }, [sort])

    const topN = 60
    let topPickCount = visibleEntries.find(entry => entry.displayRank === topN)?.currentPicks || 0
    topPickCount = topPickCount > 2 ? topPickCount : 0

    const topPicks = useMemo(() => {
        return visibleEntries.filter(entry => entry.currentPicks >= topPickCount)
    }, [visibleEntries, topPickCount])

    const morePicks = useMemo(() => {
        return visibleEntries.filter(entry => entry.currentPicks < topPickCount)
    }, [visibleEntries, topPickCount])


    const uniqueBeltsAll = useMemo(() => ['All Belts', ...uniqueBelts], [])
    
    const nextBelt = useCallback(() => {
        const currentBeltIndex = uniqueBeltsAll.findIndex(x => x === userBelt)
        const changeBeltIndex = currentBeltIndex < uniqueBeltsAll.length - 1 ? currentBeltIndex + 1 : 0
        addFilter('userBelt', uniqueBeltsAll[changeBeltIndex], true)
    }, [addFilter, uniqueBeltsAll, userBelt])


    const previousBelt = useCallback(() => {
        const currentBeltIndex = uniqueBeltsAll.findIndex(x => x === userBelt)
        const changeBeltIndex = currentBeltIndex > 0 ? currentBeltIndex - 1 : uniqueBeltsAll.length - 1
        addFilter('userBelt', uniqueBeltsAll[changeBeltIndex], true)
    }, [addFilter, uniqueBeltsAll, userBelt])


    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleChange = useCallback(event => {
        if (event.target.value !== 'All Belts') {
            addFilter('userBelt', event.target.value, true)
        } else {
            removeFilters(['userBelt'])
        }
        handleClose()
    }, [addFilter, handleClose, removeFilters])

    const handleShowMore = useCallback(() => {
        setShowMore(!showMore)
    }, [showMore])

    return (
        <React.Fragment>
            <div style={{marginBottom: 10, display: 'flex', justifyContent: 'center'}}>
                <div style={{
                    padding: '0px',
                    width: 220,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Tooltip title='Previous Belt' arrow disableFocusListener>
                        <IconButton onClick={previousBelt}
                                    style={{backgroundColor: '#bbb', color: '#000', height: 24, width: 24}}>
                            <NavigateBeforeIcon/>
                        </IconButton>
                    </Tooltip>
                    <div style={{
                        padding: '0px',
                        display: 'flex',
                        justifyContent: 'center',
                        flexGrow: 1,
                        alignItems: 'center'
                    }}>
                        <FormControl id='beltPulldown' size='small' variant='outlined'
                                     style={{marginBottom: 0, width: 140}}>
                            <InputLabel style={{color: '#bbb'}}>User Belt</InputLabel>
                            <Select
                                id='beltSelect'
                                value={userBelt || 'All Belts'}
                                label='Brand'
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                onChange={handleChange}
                                style={{
                                    fontWeight: 700,
                                    color: '#eee',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {uniqueBeltsAll.map((_beltName, index) =>
                                    <MenuItem key={index}
                                              value={uniqueBeltsAll[index]}>{uniqueBeltsAll[index]}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>
                    <Tooltip title='Next Belt' arrow disableFocusListener>
                        <IconButton onClick={nextBelt}
                                    style={{backgroundColor: '#bbb', color: '#000', height: 24, width: 24}}>
                            <NavigateNextIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <ViewFilterButtons sortValues={scorecardExploreSortFields}
                               extraFilters={[{key: 'tab', value: 'search'}]}
                               compactMode={false} resetAll={true} expandAll={false}
                               style={{marginBottom: 10}}/>

            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={{border: '4px solid #1c1c1c', width: '100%', maxWidth: 600}}>
                    <TableContainer sx={{backgroundColor: '#111', width: '100%'}}>
                        <Table style={{backgroundColor: '#1c1c1c'}}>
                            <TableHead>
                                <TableRow style={{padding: '0px', fontWeight: 700}}>
                                    <TableCell colSpan='2' style={{padding:1, fontWeight: 700, fontSize:'1.05rem'}}>Lock</TableCell>
                                    <TableCell style={{padding:1, fontWeight: 700, fontSize:'1.05rem', paddingRight:5}}>Picks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topPicks.map((entry, index) =>
                                    <ScorecardPick entry={entry} index={index} key={index}/>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Collapse in={!!showMore} timeout='auto' unmountOnExit>
                        <TableContainer sx={{backgroundColor: '#111', width: '100%'}}>
                            <Table style={{backgroundColor: '#1c1c1c'}}>
                                <TableBody>
                                    {morePicks.map((entry, index) =>
                                        <ScorecardPick entry={entry} index={index} key={index}/>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Collapse>
                </div>
            </div>
            {morePicks.length > 0 &&
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div style={{border: '4px solid #1c1c1c', width: '100%', maxWidth: 600, textAlign: 'center'}}>
                        <Link onClick={handleShowMore} style={{color: '#fff', fontSize: '1.0rem', cursor: 'pointer'}}>
                            {!showMore && 'Show More' || 'Show Less'}
                        </Link>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

