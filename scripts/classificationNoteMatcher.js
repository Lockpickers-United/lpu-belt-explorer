export function findLastMentionedVoter(note, voters) {
    if (!note) return undefined

    let lastVoter
    let lastIndex = -1

    for (const voter of voters) {
        for (const name of [voter.displayName, ...(voter.aliases || [])]) {
            if (typeof name !== 'string' || !name.trim()) continue

            const escapedName = name.trim().replace(/[$.*+?^{}()|[\]\\]/g, '\\$&')
            const pattern = new RegExp('(?<![\\p{L}\\p{N}_])' + escapedName + '(?![\\p{L}\\p{N}_])', 'giu')

            for (const match of note.matchAll(pattern)) {
                if (match.index > lastIndex) {
                    lastVoter = voter
                    lastIndex = match.index
                }
            }
        }
    }

    return lastVoter
}
