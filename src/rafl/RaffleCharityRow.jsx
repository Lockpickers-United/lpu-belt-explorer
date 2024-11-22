import React, {useCallback} from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Link from '@mui/material/Link'
import useWindowSize from '../util/useWindowSize.jsx'

function RaffleCharityRow({charity}) {
    const {isMobile} = useWindowSize()

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const charityName = charity.url
        ? <Link onClick={() => openInNewTab(charity.url)}
                style={{color: '#fff', fontWeight:500}}>{charity.name}</Link>
        : <span style={{color:'#ddd'}}>{charity.name}</span>

    const fontSize = !isMobile ? '1.0rem' : '0.9rem'

    const cellStyle = {fontSize: fontSize, border:0, padding:'10px 16px'}

    return (

        <TableRow sx={{
            '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
            'td, th': {}
        }}>
            <TableCell align={'left'} style={cellStyle}>
                {charityName}
            </TableCell>
            <TableCell align={'center'} style={cellStyle}>
                {charity.donations2024 > 0 && new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumSignificantDigits: 3
                }).format(charity.donations2024)}
            </TableCell>
            <TableCell align={'center'} style={cellStyle}>
                -
            </TableCell>
        </TableRow>

    )
}

export default RaffleCharityRow
