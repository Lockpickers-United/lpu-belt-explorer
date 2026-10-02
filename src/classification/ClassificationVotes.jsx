import React, {useContext} from 'react'
import belts, {beltSort} from '../data/belts'
import dayjs from 'dayjs'
import AuthContext from '../app/AuthContext.jsx'
import Tooltip from '@mui/material/Tooltip'

export default function ClassificationVotes({votes}) {
    const {user} = useContext(AuthContext)

    const sortedVotes = [...votes || []].sort((a, b) => {
        return beltSort(a.votedBelt, b.votedBelt) || dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf()
    })

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 2}}>
            {sortedVotes.map((vote) => {
                const blackLevel = vote.votedBelt.toLowerCase().match(/black (\d)/)
                    ? vote.votedBelt.toLowerCase().match(/black (\d)/)[1]
                    : null
                return (
                    <Tooltip title={vote.displayName}>
                        <div key={vote.id}
                             style={{
                                 height: 32, width: 32, padding: 2,
                                 color: '#ccc', lineHeight: '0.85rem',
                                 backgroundColor: belts[vote.votedBelt].color,
                                 border: vote.userId === user.uid ? '1px solid #999' : '1px solid #222'
                             }}>
                            <div style={{
                                color: '#aaa',
                                fontSize: '0.95rem',
                                width: '100%'
                            }}>{vote.displayName.substring(0, 1).toUpperCase()}</div>
                            <div style={{
                                color: '#ccc',
                                fontSize: '0.7rem',
                                width: '100%',
                                textAlign: 'right'
                            }}>{blackLevel}</div>
                        </div>
                    </Tooltip>
                )
            })}
        </div>
    )
}