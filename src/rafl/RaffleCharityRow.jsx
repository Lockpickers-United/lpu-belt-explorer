import React, {useCallback, useContext} from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Link from '@mui/material/Link'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'

function RaffleCharityRow({charity}) {
    const {isMobile} = useWindowSize()
    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const charityName = charity.url
        ? <Link onClick={() => openInNewTab(charity.url)}
                style={{color: '#fff', fontWeight: 500}}>{charity.name}</Link>
        : <span style={{color: '#ddd'}}>{charity.name}</span>

    const fontSize = !isMobile ? '1.0rem' : '0.95rem'

    const cellStyle = !isMobile
        ? {fontSize: fontSize, border: 0, padding: '8px 16px'}
        : {fontSize: fontSize, border: 0, padding: '6px 10px'}

    return (

        <TableRow sx={{
            '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
            'td, th': {}
        }}>
            <TableCell align={'left'} style={cellStyle}>
                {charityName}
            </TableCell>
            {showFull &&
                <React.Fragment>

                    <TableCell align={'center'} style={cellStyle}>
                        {charity.donationsPrevious > 0 && new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumSignificantDigits: 3
                        }).format(charity.donationsPrevious)}
                    </TableCell>
                    <TableCell align={'center'} style={cellStyle}>
                        {charity.donations > 0 && new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumSignificantDigits: 3
                        }).format(charity.donations)}
                    </TableCell>
                </React.Fragment>
            }
        </TableRow>

    )
}

export default RaffleCharityRow
