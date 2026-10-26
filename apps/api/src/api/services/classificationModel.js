import {createHash} from 'node:crypto'

export const voteBelts = [
    'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Red',
    'Black 1', 'Black 2', 'Black 3', 'Black 4', 'Black 5'
]

export function voteIdFor(entryId, userId) {
    return `v_${createHash('sha256').update(entryId).update('\0').update(userId).digest('hex')}`
}

export function timestampMs(value) {
    if (!value) return 0
    if (typeof value.toMillis === 'function') return value.toMillis()
    return new Date(value).getTime()
}

export function isCurrentVote(vote, milestone, reopened) {
    return reopened || timestampMs(vote.updatedAt ?? vote.createdAt) >= timestampMs(milestone)
}

export function buildEntryProjections(entryId, votes, previous = {}, action = null, now) {
    const milestone = previous.decisionMilestoneAt ?? null
    const reopened = previous.reopened ?? false
    const currentVoteChips = []
    const previousVoteChips = []
    const voterIds = []
    const currentBeltCounts = {}
    let latestVoteAt = null

    for (const vote of votes) {
        voterIds.push(vote.userId)
        const chip = {
            id: vote.id,
            userId: vote.userId,
            displayName: vote.displayName,
            votedBelt: vote.votedBelt,
            updatedAt: vote.updatedAt ?? vote.createdAt
        }
        if (isCurrentVote(vote, milestone, reopened)) {
            currentVoteChips.push(chip)
            currentBeltCounts[vote.votedBelt] = (currentBeltCounts[vote.votedBelt] ?? 0) + 1
            if (!latestVoteAt || timestampMs(chip.updatedAt) > timestampMs(latestVoteAt)) {
                latestVoteAt = chip.updatedAt
            }
        } else {
            previousVoteChips.push(chip)
        }
    }

    const newestFirst = (a, b) => timestampMs(b.updatedAt) - timestampMs(a.updatedAt)
        || a.id.localeCompare(b.id)
    currentVoteChips.sort(newestFirst)
    previousVoteChips.sort(newestFirst)
    const currentVoteCount = currentVoteChips.length
    const leadingCount = Math.max(0, ...Object.values(currentBeltCounts))
    const highestVoteBelt = currentVoteChips.reduce((highest, chip) => {
        return voteBelts.indexOf(chip.votedBelt) > voteBelts.indexOf(highest)
            ? chip.votedBelt : highest
    }, null)
    const revision = (previous.revision ?? 0) + 1

    return {
        summary: {
            entryId,
            decisionMilestoneAt: milestone,
            lastDecisionStatus: previous.lastDecisionStatus ?? null,
            reopened,
            currentActionId: action?.id ?? null,
            currentActionStatus: action?.status ?? null,
            currentVoteChips,
            previousVoteChips,
            currentVoteCount,
            currentBeltCounts,
            hasModernVotes: votes.length > 0,
            hasPreviousModernVotes: previousVoteChips.length > 0,
            hasConsensus: leadingCount >= 3 && leadingCount > currentVoteCount / 2,
            highestVoteBelt,
            latestVoteAt,
            revision,
            updatedAt: now
        },
        state: {
            entryId,
            decisionMilestoneAt: milestone,
            reopened,
            voterIds: [...new Set(voterIds)].sort(),
            revision
        }
    }
}
