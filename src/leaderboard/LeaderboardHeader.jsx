import React, {useCallback} from 'react'
import {useSearchParams} from 'react-router-dom'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import NumbersIcon from '@mui/icons-material/Numbers'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

function LeaderboardHeader({columns}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const sort = searchParams.get('sort')
    const style = {border: 0, padding: '4px 12px', backgroundColor: '#000'}

    const handleSort = useCallback(value => () => {
        if (value && value !== sort) {
            searchParams.set('sort', value)
        } else {
            searchParams.delete('sort')
        }
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams, sort])

    const headerIcons = {
        own: <LockIcon color={sort === 'own' ? 'secondary' : undefined} onClick={handleSort('own')}
                       style={{cursor: 'pointer'}}/>,
        picked: <LockOpenOutlinedIcon color={sort === 'picked' ? 'secondary' : undefined} onClick={handleSort('picked')}
                       style={{cursor: 'pointer'}}/>,
        wishlist: <SavingsOutlinedIcon color={sort === 'wishlist' ? 'secondary' : undefined} onClick={handleSort('wishlist')}
                       style={{cursor: 'pointer'}}/>,
        recordedLocks: <VideocamOutlinedIcon color={sort === 'recordedLocks' ? 'secondary' : undefined} onClick={handleSort('recordedLocks')}
                       style={{cursor: 'pointer'}}/>,
        safelocksOwn: <LockIcon color={sort === 'safelocksOwn' ? 'secondary' : undefined} onClick={handleSort('safelocksOwn')}
                       style={{cursor: 'pointer'}}/>,
        safelocksCracked: <LockOpenOutlinedIcon color={sort === 'safelocksCracked' ? 'secondary' : undefined} onClick={handleSort('safelocksCracked')}
                       style={{cursor: 'pointer'}}/>,
        safelocksWishlist: <SavingsOutlinedIcon color={sort === 'safelocksWishlist' ? 'secondary' : undefined} onClick={handleSort('safelocksWishlist')}
                       style={{cursor: 'pointer'}}/>,
        danLevel: <SportsMartialArtsIcon color={sort === 'danLevel' ? 'secondary' : undefined} onClick={handleSort('danLevel')}
                       style={{cursor: 'pointer'}}/>,
        danPoints: <NumbersIcon color={sort === 'danPoints' ? 'secondary' : undefined} onClick={handleSort('danPoints')}
                       style={{cursor: 'pointer'}}/>,
        blackBeltAwardedAt: <EventAvailableIcon color={sort === 'blackBeltAwardedAt' ? 'secondary' : undefined} onClick={handleSort('blackBeltAwardedAt')}
                       style={{cursor: 'pointer'}}/>,


    }

    return (
        <TableHead>
            <TableRow>
                <TableCell align='center' style={style}>
                    <Tooltip title='Sort Default' arrow disableFocusListener>
                        <span style={{cursor: 'pointer'}} onClick={handleSort(undefined)}>#</span>
                    </Tooltip>
                </TableCell>
                <TableCell
                    key='Display Name'
                    style={{
                        fontWeight: 700, fontSize: '1.2rem', border: 0,
                        padding: '4px 16px 4px 0px',
                        backgroundColor: '#000'
                    }}
                >
                    Name
                </TableCell>

                {columns.map((column, index) => {
                    return (
                        <TableCell align='center' style={style} key={index}>
                            <Tooltip title={column.tooltip} arrow disableFocusListener>
                                {headerIcons[column.field]}
                            </Tooltip>
                        </TableCell>
                    )
                })}

            </TableRow>
        </TableHead>
    )
}

export default LeaderboardHeader
