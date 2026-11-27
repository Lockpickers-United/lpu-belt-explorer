
export function pickWeightedRandomWinners(entrants = [], count = 1) {
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

export function pickRandomWinners(entrants = [], count = 1) {
    const pool = (entrants || []).slice()
    const winners = []
    while (winners.length < count && pool.length > 0) {
        const index = Math.floor(Math.random() * pool.length)
        winners.push(pool.splice(index, 1)[0])
    }
    return winners
}

