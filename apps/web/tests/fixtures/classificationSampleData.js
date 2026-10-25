import fixtures from './classification-test-data.json'

export function adminActionsForVotes(realVotes) {
    const voteTime = vote => Date.parse(vote.updatedAt ?? vote.createdAt)
    const reopenedVotes = realVotes.filter(vote => vote.entryId === 'e2fd1519').sort((a, b) => voteTime(a) - voteTime(b))
    const settledVotes = realVotes.filter(vote => vote.entryId === 'fe9889e2')
    const reopenedAt = new Date((voteTime(reopenedVotes[0]) + voteTime(reopenedVotes[1])) / 2).toISOString()
    const settledAt = new Date(Math.max(...settledVotes.map(voteTime)) + 1).toISOString()

    return fixtures.adminActions.map(action => {
        if (action.status === 'Re-opened') return {...action, updatedAt: reopenedAt}
        if (action.status === 'Settled') return {...action, updatedAt: settledAt}
        return action
    })
}
