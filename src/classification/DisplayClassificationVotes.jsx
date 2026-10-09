import React, {useContext} from 'react'
import belts, {beltSort} from '../data/belts'
import dayjs from 'dayjs'
import AuthContext from '../app/AuthContext.jsx'
import Tooltip from '@mui/material/Tooltip'
import useWindowSize from '../util/useWindowSize.jsx'

export default function DisplayClassificationVotes({votes, style = {}}) {
    const {user} = useContext(AuthContext)
    const {isMobile} = useWindowSize()

    if (!votes?.length) return null

    const sortedVotes = votes.toSorted((a, b) => {
        return beltSort(a.votedBelt, b.votedBelt) ||
            dayjs(a.updatedAt ?? a.createdAt).valueOf() - dayjs(b.updatedAt ?? b.createdAt).valueOf()
    })

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', flexGrow: 1, ...style}}>
            {sortedVotes.map((vote) => {
                const num = vote.votedBelt.toLowerCase().match(/black (\d)/)
                const blackLevel = num && num[1] > 1
                    ? num[1]
                    : null
                const displayName = !isMobile
                    //? vote.displayName.substring(0, 1).toUpperCase() + vote.displayName.substring(1, 3).toLowerCase()
                    ? undefined
                    : undefined

                const size = !isMobile ? 28 : 24

                return (
                    <Tooltip key={vote.id} title={vote.displayName}>
                        <div style={{
                            position: 'relative',
                            height: size, width: size, padding: 2,
                            color: '#ccc', lineHeight: '0.85rem',
                            backgroundColor: belts[vote.votedBelt]?.color,
                            border: vote.userId === user.uid ? '1px solid #999' : '1px solid #222'
                        }}>
                            {displayName &&
                                <div style={{
                                color: '#999',
                                fontSize: '0.8rem',
                                width: '100%'
                            }}>{displayName}</div>
                            }
                            <div style={{
                                color: '#ddd',
                                position: 'absolute',
                                bottom: 2,
                                right: 4,
                                fontSize: '0.7rem',
                                textAlign: 'right'
                            }}>{blackLevel}</div>
                        </div>
                    </Tooltip>
                )
            })}
        </div>
    )
}
