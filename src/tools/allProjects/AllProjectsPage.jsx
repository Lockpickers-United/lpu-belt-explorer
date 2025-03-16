import React, {useCallback, useMemo, useState} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import dayjs from 'dayjs'
import useWindowSize from '../../util/useWindowSize.jsx'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import LeaderboardName from '../../leaderboard/LeaderboardName.jsx'
import belts, {beltSortReverse} from '../../data/belts'
import {useSearchParams} from 'react-router-dom'
import Link from '@mui/material/Link'
import ChoiceButtonGroup from '../../util/ChoiceButtonGroup.jsx'

/**
 * @property evidenceName
 */



function AllProjectsPage({projects, updated}) {
    const {isMobile} = useWindowSize()

    const options = useMemo(() => {
        return [
            {label: 'All'},
            {label: 'Scorecard Only'},
        ]
    }, [])
    const [selected, setSelected] = useState(options[0])
    const handleChange = useCallback(newValue => setSelected(newValue), [])

    const filteredProjects = selected.label === 'Scorecard Only'
        ? projects.filter(evidence => !evidence.tabName)
        : projects

    const [searchParams, setSearchParams] = useSearchParams()
    const sort = searchParams.get('sort')
    const evSort = sort && sort.includes('ev')
    const [reverseSort, setReverseSort] = useState(false)
    const [reverseEvSort, setReverseEvSort] = useState(false)

    const handleSort = useCallback(value => () => {
        if (sort && value !== sort) {
            searchParams.set('sort', value)
            setReverseSort(!evSort ? false : reverseSort)
            setReverseEvSort(evSort ? false : reverseEvSort)
        } else if (sort && value === sort) {
            setReverseSort(!evSort ? !reverseSort : reverseSort)
            setReverseEvSort(evSort ? !reverseEvSort : reverseEvSort)
        } else if (value === 'date') {
            searchParams.set('sort', value)
            setReverseSort(true)
        } else if (value === 'evDate') {
            searchParams.set('sort', value)
            setReverseEvSort(true)
        } else {
            searchParams.set('sort', value)
        }
        setSearchParams(searchParams)
    }, [evSort, reverseEvSort, reverseSort, searchParams, setSearchParams, sort])

    const baseSortEvidence = useMemo(() => {
        if (projects.length > 1 && sort) {
            return filteredProjects.sort((a, b) => {
                if (sort === 'evName') {
                    return (a.displayName || '').localeCompare(b.displayName || '')
                } else if (sort === 'evLock') {
                    return a.evidenceName.localeCompare(b.evidenceName) || a.displayName.localeCompare(b.displayName)
                } else if (sort === 'evBelt') {
                    return beltSortReverse(a.belt.replace(' Belt', ''), b.belt.replace(' Belt', '')) || a.displayName.localeCompare(b.displayName)
                } else if (sort === 'evDate') {
                    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                }
            })
        } else {
            return filteredProjects.sort((a, b) => {
                return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
            })
        }
    }, [sort, projects, reverseEvSort]) // eslint-disable-line

    const sortedEvidence = useMemo(() => {
        return reverseEvSort ? baseSortEvidence.reverse() : baseSortEvidence
    }, [baseSortEvidence, reverseEvSort])

    const nameWidth = isMobile ? 'auto' : '170px'
    const maxLength = isMobile ? 16 : 20

    const bgColor = useCallback(value => {
        const belt = value.replace(' Belt', '')
        return belts[belt]
            ? belts[belt].color
            : value.includes('Dan')
                ? '#769e49'
                : '#b00'
    }, [])

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    return (
        <React.Fragment>
            <div style={{justifyItems: 'center', marginTop: 40}}>
                <div style={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    width: '100%',
                    textAlign: 'center',
                    margin: '20px 0px'
                }}>Recent Projects
                    <div style={{
                        fontWeight: 400,
                        fontSize: '0.9rem',
                        width: '100%',
                        textAlign: 'center',
                        margin: '0px 0px'
                    }}>Through {dayjs(updated).format('MMM DD, YYYY')}
                    </div>
                </div>
                <div style={{marginBottom:20}}>
                <ChoiceButtonGroup options={options} onChange={handleChange}/>
                </div>
                <TableContainer sx={{backgroundColor: '#111', maxWidth: 650}}>
                    <Table sx={{minWidth: 360, align: 'left'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' style={{
                                    fontWeight: 700, fontSize: '1.0rem', border: 0,
                                    padding: '4px 0px 4px 16px',
                                    backgroundColor: '#222', width: nameWidth
                                }}
                                ><span style={sort === 'evName' ? {} : {cursor: 'pointer', color: '#ccc'}}
                                       onClick={handleSort('evName')}>User</span></TableCell>
                                <TableCell align='left' colSpan={2} style={{
                                    fontWeight: 700, fontSize: '1.0rem', border: 0,
                                    padding: '0px 0px 0px 4px',
                                    backgroundColor: '#222'
                                }}
                                ><span style={sort === 'evLock' ? {} : {cursor: 'pointer', color: '#ccc'}}
                                       onClick={handleSort('evLock')}>Project</span>
                                    <span style={sort === 'evBelt' ? {} : {cursor: 'pointer', color: '#ccc'}}
                                          onClick={handleSort('evBelt')}>&nbsp;(Tier)</span>
                                </TableCell>
                                <TableCell align='center' style={{
                                    fontWeight: 700, fontSize: '1.0rem', border: 0,
                                    padding: 0,
                                    backgroundColor: '#222'
                                }}
                                >
                                    <span style={!evSort || sort === 'evDate' ? {} : {cursor: 'pointer', color: '#ccc'}}
                                          onClick={handleSort('evDate')}>Date</span></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedEvidence.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#000'},
                                        'td, th': {padding: '6px 2px', border: 0}
                                    }}
                                >
                                    <TableCell align='left' style={{padding: '0px 0px 0px 16px'}}>
                                    <span style={{fontWeight: 500, width: nameWidth}}>
                                       <LeaderboardName leader={row} isCurrentUser={row.isCurrentUser}
                                                        tab='blackBelts' maxLength={maxLength}/>
                                    </span>
                                    </TableCell>

                                    <TableCell align='left' style={{
                                        backgroundColor: bgColor(row.belt),
                                        borderBottom: '1px solid #333', width: 4, marginLeft: 5
                                    }}/>

                                    <TableCell align='left'>
                                        <div style={{fontWeight: 500, marginLeft: 5}}>
                                            <Link onClick={() => openInNewTab(row.evidenceUrl)}
                                                  style={{color: '#fff'}}>{row.evidenceName}</Link>
                                        </div>
                                    </TableCell>

                                    <TableCell align='center'>
                                        <nobr>{dayjs(row.date).format('MMM DD, YYYY')}</nobr>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </React.Fragment>
    )
}


export default AllProjectsPage
