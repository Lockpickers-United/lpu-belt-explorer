import React, {useCallback, useContext, useRef, useState} from 'react'
import DataContext from '../context/DataContext.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import RaffleCharityRow from './RaffleCharityRow.jsx'
import Link from '@mui/material/Link'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleSearchBar from './RaffleSearchBar.jsx'

function RaffleCharitesPage() {
    const {visibleEntries} = useContext(DataContext)
    const {isMobile} = useWindowSize()
    const scrollableRef = useRef()

    const [sort, setSort] = useState('name')

    const handleSort = useCallback((columnId) => {
        if (columnId !== sort) {
            setSort(columnId)
        }
    }, [setSort, sort])



    const visibleCharities = visibleEntries
        .sort((a, b) => {
            switch (sort) {
                case '2024':
                    return b.donations2024 - a.donations2024
                case '2025':
                    return b.donations2025 - a.donations2025
                case 'name':
                    return a['name'].localeCompare(b['name'])
                default:
                    return a['name'].localeCompare(b['name'])
            }
        })

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const headerSize = !isMobile ? '1.0rem' : '0.85rem'

    return (

        <div style={{...style, paddingBottom: 32}}>
            <div style={{height:8}}/>

            <RaffleSearchBar label='Approved Charities' sortValues={null}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Charities'/>}

            {visibleEntries.length > 0 &&
                <TableContainer sx={{height: '100%', backgroundColor: '#111'}} id='scrollable'
                                ref={scrollableRef}>
                    <Table stickyHeader style={style}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    key='Charity Name'
                                    style={{
                                        fontWeight: 700, fontSize: headerSize, lineHeight: '1.3rem', border: 0,
                                        backgroundColor: '#222'
                                    }}
                                >
                                    <Link onClick={() => handleSort('name')}
                                          style={{color: sort === 'name' ? '#fff' : '#ccc'}}>Charity Name</Link>
                                </TableCell>
                                <TableCell
                                    key='2024'
                                    style={{
                                        fontWeight: 700, fontSize: headerSize, lineHeight: '1.3rem', border: 0,
                                        backgroundColor: '#222',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Link onClick={() => handleSort('2024')}
                                          style={{color: sort === '2024' ? '#fff' : '#ccc'}}>2024 Contributions</Link>
                                </TableCell>
                                <TableCell
                                    key='2025'
                                    style={{
                                        fontWeight: 700, fontSize: headerSize, lineHeight: '1.3rem', border: 0,
                                        backgroundColor: '#222',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Link onClick={() => handleSort('2025')}
                                          style={{color: sort === '2025' ? '#fff' : '#ccc'}}>2025 So&nbsp;Far</Link>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCharities.map((charity, index) =>
                                <RaffleCharityRow charity={charity} key={index}/>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    )
}

export default RaffleCharitesPage
