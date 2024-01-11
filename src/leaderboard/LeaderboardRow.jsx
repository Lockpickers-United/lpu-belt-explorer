import TableRow from '@mui/material/TableRow'
import React, {useEffect, useRef, useState} from 'react'
import LeaderboardCell from './LeaderboardCell'

function LeaderboardRow({index, leader, user, highlighted, scrollableRef}) {
    const ref = useRef()
    const [scrolled, setScrolled] = useState(false)

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
            key={leader.id}
            ref={ref}
            sx={{
                '&:nth-of-type(even) td, &:nth-of-type(even) th': highlighted ? {} : {backgroundColor: '#000'},
                'td, th': {padding: '6px 2px', border: 0},
                ...style
            }}
        >
            <LeaderboardCell leader={leader} user={user} value={index + 1}/>
            <LeaderboardCell leader={leader} user={user} value={leader.displayName || 'Anonymous'} align='left'/>
            <LeaderboardCell leader={leader} user={user} value={leader.own}/>
            <LeaderboardCell leader={leader} user={user} value={leader.picked}/>
            <LeaderboardCell leader={leader} user={user} value={leader.recorded}/>
            <LeaderboardCell leader={leader} user={user} value={leader.wishlist}/>
        </TableRow>
    )
}

export default LeaderboardRow
