import TableRow from '@mui/material/TableRow'
import React, {useContext, useEffect, useRef, useState} from 'react'
import AuthContext from '../app/AuthContext'
import LeaderboardCell from './LeaderboardCell'
import LeaderboardName from './LeaderboardName'

function LeaderboardRow({index, leader, highlighted, scrollableRef}) {
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
            key={leader.id}
            ref={ref}
            sx={{
                '&:nth-of-type(even) td, &:nth-of-type(even) th': highlighted ? {} : {backgroundColor: '#000'},
                'td, th': {padding: '6px 2px', border: 0},
                ...style
            }}
        >
            <LeaderboardCell isCurrentUser={isCurrentUser} leader={leader} value={index + 1}/>
            <LeaderboardCell isCurrentUser={isCurrentUser} leader={leader} value={
                <LeaderboardName isCurrentUser={isCurrentUser} leader={leader}/>
            } align='left'/>
            <LeaderboardCell isCurrentUser={isCurrentUser} leader={leader} value={leader.own}/>
            <LeaderboardCell isCurrentUser={isCurrentUser} leader={leader} value={leader.picked}/>
            <LeaderboardCell isCurrentUser={isCurrentUser} leader={leader} value={leader.recorded}/>
            <LeaderboardCell isCurrentUser={isCurrentUser} leader={leader} value={leader.wishlist}/>
        </TableRow>
    )
}

export default LeaderboardRow
