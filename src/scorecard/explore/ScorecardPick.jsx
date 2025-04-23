import React, {useCallback} from 'react'
import entryName from '../../entries/entryName'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import belts from '../../data/belts'

export default function ScorecardPick({entry, index, collapse = false}) {

    const bgColor = useCallback(value => {
        const belt = value.replace(' Belt', '')
        return belts[belt]
            ? belts[belt].color
            : value.includes('Dan')
                ? '#769e49'
                : '#b00'
    }, [])


    return (
            <TableRow
                key={index}
                sx={{
                    '&:nth-of-type(odd) td, &:nth-of-type(odd) th': {backgroundColor: '#000'},
                    'td, th': {padding: '6px 2px', border: 0}
                }}
                style={{display: collapse ? 'table-row' : 'table-row'}}
            >
                <TableCell align='left' style={{
                    backgroundColor: bgColor(entry.belt),
                    borderBottom: '1px solid #333', width: 4, marginLeft: 5,
                    height: 0
                }}/>
                <TableCell align='left' style={{alignItems: 'center'}}>
                        <div style={{fontWeight: 500, marginLeft: 5, fontSize:'0.9rem'}}>{entryName(entry)}</div>
                </TableCell>
                <TableCell align='center' style={{fontWeight: 500, fontSize:'0.9rem', paddingRight:5}}>
                        {entry.currentPicks}
                </TableCell>
            </TableRow>
    )
}