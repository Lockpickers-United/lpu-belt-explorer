import React, {useCallback, useContext, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../../util/useWindowSize.jsx'
import DBContext from '../../app/DBContext.jsx'

// Picks a random entrant weighted by the number of tickets
// entrants: Array<{ name: string, tickets: number }>
export function pickWeightedRandom(entrants = []) {
    const cleaned = (entrants || []).map(e => ({
        ...e,
        tickets: Number(e?.tickets || 0)
    })).filter(e => e.tickets > 0)

    if (!cleaned.length) return null

    const total = cleaned.reduce((acc, e) => acc + e.tickets, 0)
    const r = Math.random() * total
    let acc = 0
    for (let i = 0; i < cleaned.length; i++) {
        acc += cleaned[i].tickets
        if (r < acc) return cleaned[i]
    }
    // Fallback (shouldn't happen due to loop logic)
    return cleaned[cleaned.length - 1]
}

export function pickWeightedRandomMultiple(entrants = [], count = 1) {
    const cleaned = (entrants || []).map(e => ({
        ...e,
        tickets: Number(e?.potTickets || 0)
    })).filter(e => e.potTickets > 0)
    if (!cleaned.length || count <= 0) return []
    const pool = cleaned.slice()
    const winners = []
    const drawOnce = (list) => {
        const total = list.reduce((acc, e) => acc + e.tickets, 0)
        if (total <= 0) return null
        const r = Math.random() * total
        let acc = 0
        for (let i = 0; i < list.length; i++) {
            acc += list[i].tickets
            if (r < acc) return {winner: list[i], index: i}
        }
        return {winner: list[list.length - 1], index: list.length - 1}
    }
    while (winners.length < count && pool.length > 0) {
        const drawn = drawOnce(pool)
        if (!drawn) break
        winners.push(drawn.winner)
        // remove winner from pool to avoid duplicates
        pool.splice(drawn.index, 1)
    }
    return winners
}

export function pickWinnersForEntry(entry) {
    if (!entry || !Array.isArray(entry.entrants)) return []
    const count = Number(entry?.winnerCount|| 1)
    return pickWeightedRandomMultiple(entry.entrants, Math.max(1, count))
}

export default function RaffleDrawButton({entry}) {

    const {updateRaffleWinners, updateRaffleEntry} = useContext(DBContext)

    const drawingText = (entry.winnerCount > 1) ? 'WINNERS' : 'WINNER'


    const [winners, setWinners] = useState([])
    const [winnerCounts, setWinnerCounts] = useState({})


    const draw = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()

        const w = pickWinnersForEntry(entry)
        setWinners(w)
        // Update local winner counts by entrant name as key (demo)
        setWinnerCounts(prev => {
            const next = {...prev}
            w.forEach(win => {
                const key = win.name
                next[key] = (next[key] || 0) + 1
            })
            return next
        })
        console.log('entry.winners', w)

        updateRaffleWinners(entry.id, w)
    }, [entry, updateRaffleWinners])


    const {isMobile} = useWindowSize()

    return (
        <React.Fragment>
            { !entry.winners || entry.winners?.length === 0 &&
                <div style={{marginLeft: 20}}>
                    <Button onClick={draw}
                            color='secondary' variant='contained' size='small'
                            style={{
                                fontWeight: 600, fontSize: '0.9rem', marginTop: !isMobile ? -3 : 0,
                                whiteSpace: 'nowrap', width: 135
                            }}>
                        DRAW {drawingText}
                    </Button>
                </div>
            }
        </React.Fragment>
    )
}
