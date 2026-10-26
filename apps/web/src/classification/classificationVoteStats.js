import dayjs from 'dayjs'
import {highestBelt} from '../data/belts.js'

export default function classificationVoteStats(votes) {
    const voteCounts = votes.reduce((counts, vote) => {
        counts[vote.votedBelt] = (counts[vote.votedBelt] ?? 0) + 1
        return counts
    }, {})
    const leadingCount = Math.max(0, ...Object.values(voteCounts))
    const votedBelts = votes.map(vote => vote.votedBelt)

    return {
        hasVotes: votes.length > 0 ? 'Yes' : 'No',
        voteCount: votes.length,
        hasConsensus: leadingCount >= 3 && leadingCount > votes.length / 2 ? 'Yes' : 'No',
        highestVoteBelt: highestBelt(votedBelts),
        latestVoteDate: votes.length
            ? Math.max(...votes.map(vote => dayjs(vote.updatedAt ?? vote.createdAt).valueOf()))
            : null
    }
}
