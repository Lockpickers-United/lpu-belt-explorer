import React, {useCallback, useMemo, useState} from 'react'

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
        tickets: Number(e?.tickets || 0)
    })).filter(e => e.tickets > 0)
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
    const count = Number(entry?.winners || 1)
    return pickWeightedRandomMultiple(entry.entrants, Math.max(1, count))
}

const entries = [
    {id: 1, name: 'Entry 1', winners: 1,
        entrants: [{name: 'Alice', tickets:200}, {name: 'Bob', tickets:50}]},
    {id: 2, name: 'Entry 2', winners: 2,
        entrants: [{name: 'Charlie', tickets:150}, {name: 'Dana', tickets:100}]},
    {id: 3, name: 'Entry 3', winners: 1,
        entrants: [{name: 'Eve', tickets:300}, {name: 'Frank', tickets:75}]},
]

function RaffleDrawingFunctionsUNUSED() {

    const [selectedEntryId, setSelectedEntryId] = useState(entries[0]?.id)
    const [winners, setWinners] = useState([])
    const [winnerCounts, setWinnerCounts] = useState({})

    const selectedEntry = useMemo(() => entries.find(e => e.id === selectedEntryId), [selectedEntryId])

    const draw = useCallback(() => {
        const w = pickWinnersForEntry(selectedEntry)
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
    }, [selectedEntry])

    console.log('winners', winners)

    return (
        <div style={{padding: 16}}>
            <h2>Raffle Drawing Page</h2>
            <div style={{marginBottom: 12}}>
                <label>
                    Choose Entry:&nbsp;
                    <select value={selectedEntryId}
                            onChange={e => setSelectedEntryId(Number(e.target.value))}>
                        {entries.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                </label>
                <button style={{marginLeft: 12}} onClick={draw}>Draw {selectedEntry?.winners || 1} Winner{(selectedEntry?.winners||1)>1?'s':''}</button>
            </div>
            <div>
                <div><b>Entrants</b></div>
                <ul>
                    {(selectedEntry?.entrants || []).map((en, idx) => (
                        <li key={idx}>{en.name} — {en.tickets} tickets</li>
                    ))}
                </ul>
            </div>
            <div style={{marginTop: 12}}>
                <b>Winners:</b>
                {winners && winners.length > 0 ? (
                    <ol>
                        {winners.map((w, i) => {
                            const count = winnerCounts[w.name] || 0
                            const flagged = count >= 2
                            return (
                                <li key={i} style={{fontWeight: flagged ? 700 : 400, color: flagged ? '#e39a29' : undefined}}>
                                    {w.name} ({w.tickets} tickets){flagged ? ' — multiple winner' : ''}
                                </li>
                            )
                        })}
                    </ol>
                ) : ' —'}
            </div>
        </div>
    )
}

export default RaffleDrawingFunctionsUNUSED
