import React, {useContext} from 'react'
import belts, {beltSort} from '../data/belts'
import dayjs from 'dayjs'
import AuthContext from '../app/AuthContext.jsx'
import Tooltip from '@mui/material/Tooltip'
import useWindowSize from '../util/useWindowSize.jsx'
import {darken} from '@mui/material/styles'

export default function DisplayClassificationVotes({votes, style = {}}) {
    const {user} = useContext(AuthContext)
    const {isMobile} = useWindowSize()

    if (!votes?.length) return null

    const sortedVotes = votes.toSorted((a, b) => {
        return beltSort(a.votedBelt, b.votedBelt) ||
            dayjs(a.updatedAt ?? a.createdAt).valueOf() - dayjs(b.updatedAt ?? b.createdAt).valueOf()
    })

    const previousColors = Object.entries(belts).reduce((acc, [belt, info]) => {
        acc[belt] = !belt.includes('Black') ? darken(info.color, 0.3) : '#444'
        return acc
    }, {})

    const size = !isMobile ? 28 : 24

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', flexGrow: 1, ...style}}>
            {sortedVotes.map((vote) => {
                const num = vote.votedBelt.toLowerCase().match(/black (\d)/)
                const blackLevel = num && num[1] > 1
                    ? num[1]
                    : null


                return (
                    <Tooltip key={vote.id} title={vote.previous
                        ? `${vote.displayName} (previous)`
                        : vote.displayName}>
                        <div style={{
                            position: 'relative',
                            height: size, width: size, padding: 2,
                            color: '#ccc', lineHeight: '0.85rem',
                            backgroundColor: belts[vote.votedBelt]?.color,
                            border: vote.userId === user.uid ? '1px solid #999' : '1px solid #222',
                            fontSize: '0.8rem'

                        }}>
                            {vote.previous &&
                                <div style={{
                                    height: 10,
                                    width: 10,
                                    borderRadius: '50%',
                                    backgroundColor: previousColors[vote.votedBelt]
                                }}></div>
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
