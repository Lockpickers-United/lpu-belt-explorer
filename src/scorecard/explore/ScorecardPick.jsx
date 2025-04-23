import React, {useCallback} from 'react'
import entryName from '../../entries/entryName'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import BeltStripeMini from '../../entries/BeltStripeMini.jsx'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'

export default function ScorecardPick({entry, index, collapse = false}) {
    const navigate = useNavigate()

    const name =  entryName(entry)
    const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

    const handleClick = useCallback((entry) => {
        const link = `/locks?tab=search&search=${entry.id}&id=${entry.id}&name=${safeName}`
        navigate(link)
    },[navigate, safeName])


    const nameColor = entry.belt === 'Unranked' ? '#bbb' : '#fff'

    return (
            <TableRow
                key={index}
                sx={{
                    '&:nth-of-type(odd) td, &:nth-of-type(odd) th': {backgroundColor: '#000'},
                    'td, th': {padding: 0, border: 0}
                }}
                style={{display: collapse ? 'table-row' : 'table-row'}}
            >
                <TableCell align='left' style={{
                    borderBottom: '1px solid #000', width: 4, marginLeft: 5,
                    height: 40, paddingBottom: 1,
                }}><BeltStripeMini value={entry.belt}/></TableCell>
                <TableCell align='left' style={{alignItems: 'center'}}>
                        <div style={{fontWeight: 500, marginLeft: 10, fontSize:'0.9rem'}}>
                            <Link onClick={() => handleClick(entry)} style={{color: nameColor}}>{entryName(entry)}</Link>
                        </div>
                </TableCell>
                <TableCell align='center' style={{fontWeight: 500, fontSize:'0.9rem', paddingRight:5}}>
                        {entry.currentPicks}
                </TableCell>
            </TableRow>
    )
}