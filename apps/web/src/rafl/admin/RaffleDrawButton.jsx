import React, {useCallback, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../../util/useWindowSize.jsx'
import DBContext from '../../app/DBContext.jsx'
import ReplayIcon from '@mui/icons-material/Replay'
import IconButton from '@mui/material/IconButton'
import ScopedDialog from '../../misc/ScopedDialog.jsx'

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

export default function RaffleDrawButton({entry, drawing=false, redrawId, excessWinner, containerRef}) {
    const {updateRaffleWinners} = useContext(DBContext)
    const [noMoreEligible, setNoMoreEligible] = useState(false)
    const handleDeleteClose = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setNoMoreEligible(false)
    },[])

    const drawingText = (entry.winnerCount > 1) ? 'WINNERS' : 'WINNER'

    const draw = useCallback(async (event) => {
        event.preventDefault()
        event.stopPropagation()
        const w = pickWinnersForEntry(entry)
        await updateRaffleWinners(entry.id, w)
        console.log('entry.winners', w)
    }, [entry, updateRaffleWinners])


    const redraw = useCallback(async (event, idToRedraw) => {
        event.preventDefault()
        event.stopPropagation()
        try {
            const currentWinners = Array.isArray(entry?.winners) ? entry.winners.slice() : []
            const winnerCount = Number(entry?.winnerCount || 1)

            // Build a set of entryIds already winning (excluding the one we're replacing)
            const existingIds = new Set(
                currentWinners
                    //.filter(w => w && w.entryId && w.entryId !== idToRedraw)
                    .map(w => w.entryId)
            )
            console.log('existingIds', existingIds)

            // Build eligible entrant pool: positive tickets, not already a winner (except the one being replaced)
            const entrants = Array.isArray(entry?.entrants) ? entry.entrants : []
            const eligible = entrants
                .map(e => ({...e, tickets: Number(e?.potTickets || 0)}))
                .filter(e => (e.tickets > 0) && (!e.entryId || !existingIds.has(e.entryId)))

            console.log('eligible', eligible)

            // If no eligible entrant remains, abort
            if (!eligible.length) {
                console.warn('No eligible entrants available for redraw for pot', entry?.id, 'redrawId', idToRedraw)
                setNoMoreEligible(true)
                return
            }

            // Draw exactly one replacement winner from eligible pool, avoiding duplicates
            const [newWinner] = pickWeightedRandomMultiple(eligible, 1)
            if (!newWinner) {
                console.warn('Redraw failed to pick a new winner for pot', entry?.id)
                return
            }

            let updatedWinners
            if (winnerCount > 1 && currentWinners.length > 0) {
                // Replace only the winner whose entryId matches idToRedraw
                let replaced = false
                updatedWinners = currentWinners.map(w => {
                    if (!replaced && w?.entryId === idToRedraw) {
                        replaced = true
                        return newWinner
                    }
                    return w
                })
                // If the specified idToRedraw was not found, do nothing
                if (!replaced) {
                    console.warn('Redraw id not found among current winners for pot', entry?.id, 'idToRedraw', idToRedraw)
                    return
                }
            } else {
                // Single-winner pot: simply set to the new winner
                updatedWinners = [newWinner]
            }

            await updateRaffleWinners(entry.id, updatedWinners)
            console.log('Redraw complete. Updated winners:', updatedWinners)
        } catch (e) {
            console.error('Error during redraw:', e)
        }
    }, [entry, updateRaffleWinners])

    const {isMobile} = useWindowSize()

    const dialogContent = (
        <div style={{textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', padding: 40}}>
            There are no other eligible entries.<br/><br/>
            <Button onClick={handleDeleteClose} variant='contained'>Sorry!</Button> <br/><br/>
        </div>
    )

    return (
        <React.Fragment>
            {redrawId && drawing
                ? <div style={{marginLeft: 2, color: '#f35454', fontWeight: 'bold'}}>
                    <IconButton onClick={(e) => redraw(e, redrawId)}
                                color='secondary' variant='contained' size='small'
                                style={{
                                    fontWeight: 600, fontSize: '0.9rem', marginTop: !isMobile ? -3 : 0,
                                    whiteSpace: 'nowrap', color: excessWinner ? '#f35454' : '#666'
                                }}>
                        <ReplayIcon fontSize='small'/>
                    </IconButton>
                </div>
                :  !entry.winners || entry.winners?.length === 0
                    ? <div style={{marginLeft: 20, marginTop: !isMobile ? 0 : 8}}>
                        <Button onClick={draw}
                                color='secondary' variant='contained' size='small'
                                style={{
                                    fontWeight: 600, fontSize: '0.9rem', marginTop: !isMobile ? -3 : 0,
                                    whiteSpace: 'nowrap', width: 135
                                }}>
                            DRAW {drawingText}
                        </Button>
                    </div>
                    : null
            }

            <ScopedDialog
                open={noMoreEligible}
                dialogContent={dialogContent}
                handleClose={handleDeleteClose}
                containerRef={containerRef}
                position={{top: 80}}
                centerX={true}
                width={isMobile ? 350 : 400}
            />

        </React.Fragment>
    )
}
