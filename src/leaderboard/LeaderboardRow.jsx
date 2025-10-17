import TableRow from '@mui/material/TableRow'
import React, {useContext, useEffect, useRef, useState} from 'react'
import AuthContext from '../app/AuthContext'
import LeaderboardCell from './LeaderboardCell'
import LeaderboardName from './LeaderboardName'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

function LeaderboardRow({index, leader, highlighted, scrollableRef, columns, tab}) {
    const ref = useRef()
    const {user} = useContext(AuthContext)
    const [scrolled, setScrolled] = useState(false)
    const isCurrentUser = user?.uid === leader.id
    const style = highlighted ? {backgroundColor: '#333'} : {}

    useEffect(() => {
        if (highlighted && ref && !scrolled) {
            setTimeout(() => {
                setScrolled(true)
                scrollableRef.current.scrollTo({
                    top: ref.current.offsetTop - 75,
                    behavior: 'smooth'
                })
            }, 0)
        }
    }, [highlighted, scrollableRef, scrolled])

    return (
        <TableRow
            aria-label={leader.displayName}
            key={leader.id}
            ref={ref}
            sx={{
                '&:nth-of-type(even) td, &:nth-of-type(even) th': highlighted ? {} : {backgroundColor: '#000'},
                'td, th': {padding: '6px 2px', border: 0},
                ...style
            }}
        >
            <LeaderboardCell isCurrentUser={isCurrentUser} value={index + 1}/>
            <LeaderboardCell isCurrentUser={isCurrentUser} value={
                <LeaderboardName isCurrentUser={isCurrentUser} leader={leader} tab={tab}
                />
            } align='left'/>

            {columns.map((column, index) => {
                const value = column.field === 'blackBeltAwardedAt'
                    ? leader[column.field] > 0
                        ? dayjs.utc(leader[column.field] * 1000).format('MM/DD/YY')
                        : '-'
                    : leader[column.field]
                return (
                    <LeaderboardCell isCurrentUser={isCurrentUser} value={value} key={index}/>
                )
            })}

        </TableRow>
    )
}

export default LeaderboardRow
