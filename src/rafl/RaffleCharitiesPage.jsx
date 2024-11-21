import React, {useContext, useRef} from 'react'
import DataContext from '../context/DataContext.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'

function RaffleCharitesPage() {
    const {visibleEntries} = useContext(DataContext)
    const scrollableRef = useRef()

    return (

        <div style={{margin: 8, paddingBottom: 32}}>
            <div style={{height: 8}}/>

            {visibleEntries.length === 0 && <NoEntriesCard label='Charities'/>}

            <TableContainer sx={{height: '100%', backgroundColor: '#111'}} id='scrollable'
                            ref={scrollableRef}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key='Charity Name'
                                style={{
                                    fontWeight: 700, fontSize: '1.2rem', border: 0,
                                    padding: '4px 16px 4px 0px',
                                    backgroundColor: '#000'
                                }}
                            >
                                Name
                            </TableCell>
                            <TableCell
                                key='2024'
                                style={{
                                    fontWeight: 700, fontSize: '1.2rem', border: 0,
                                    padding: '4px 16px 4px 0px',
                                    backgroundColor: '#000'
                                }}
                            >
                                2024 Total Conributions
                            </TableCell>
                            <TableCell
                                key='2024'
                                style={{
                                    fontWeight: 700, fontSize: '1.2rem', border: 0,
                                    padding: '4px 16px 4px 0px',
                                    backgroundColor: '#000'
                                }}
                            >
                                2025 Conributions So Far
                            </TableCell>
                        </TableRow>
                    </TableHead>

                </Table>
            </TableContainer>

            {visibleEntries.map((charity, index) =>
                <div key={index}>{charity.name}</div>
            )}

        </div>
    )
}

export default RaffleCharitesPage
