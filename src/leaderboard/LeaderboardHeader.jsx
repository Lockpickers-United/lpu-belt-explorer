import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, {useCallback} from 'react'
import {useSearchParams} from 'react-router-dom'

function LeaderboardHeader() {
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

    return (
        <TableHead>
            <TableRow>
                <TableCell align='center' style={style}>
                    #
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
                <TableCell align='center' style={style}>
                    <LockIcon
                        color={sort === 'own' ? 'secondary' : undefined}
                        onClick={handleSort('own')}
                        style={{cursor: 'pointer'}}
                    />
                </TableCell>
                <TableCell align='center' style={style}>
                    <LockOpenOutlinedIcon
                        color={sort === 'picked' ? 'secondary' : undefined}
                        onClick={handleSort('picked')}
                        style={{cursor: 'pointer'}}
                    />
                </TableCell>
                <TableCell align='center' style={style}>
                    <VideocamOutlinedIcon
                        color={sort === 'recorded' ? 'secondary' : undefined}
                        onClick={handleSort('recorded')}
                        style={{cursor: 'pointer'}}
                    />
                </TableCell>
                <TableCell align='center' style={style}>
                    <SavingsOutlinedIcon
                        color={sort === 'wishlist' ? 'secondary' : undefined}
                        onClick={handleSort('wishlist')}
                        style={{cursor: 'pointer'}}
                    />
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

export default LeaderboardHeader
