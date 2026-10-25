const draftKey = 'discordBeltRequestDraft'
const draftLifetimeMs = 60 * 60 * 1000

export function buildDiscordBeltRequest(form) {
    const isDan = form.requestBelt?.endsWith(' Dan')
    const entries = isDan ? [] : Object.keys(form)
        .filter(key => /^entry[1-6]$/.test(key) && form[key])
        .sort()
        .map(key => {
            const entry = form[key]
            const matchId = entry.matchId || undefined
            const lockId = matchId ? undefined : entry.lockId || entry.id || undefined
            if ((!matchId && !lockId) || !entry.lockName || !entry.belt || !entry.link) {
                throw new Error('Complete each lock and evidence link before posting')
            }
            return {lockName: entry.lockName, belt: entry.belt, link: entry.link,
                ...(matchId ? {matchId} : {lockId})}
        })
    const quests = isDan ? [] : Object.keys(form)
        .filter(key => /^quest[1-2]$/.test(key) && form[key])
        .sort()
        .map(key => {
            const {discipline, tier, details} = form[key]
            if (!discipline || !tier || !details?.trim()) {
                throw new Error('Complete each quest before posting')
            }
            return {discipline, tier, details}
        })
    if (!form.requestBelt || (isDan ? !form.danRequestEvidence : !entries.length)) {
        throw new Error('Complete the required evidence before posting')
    }
    const sync = form.sync?.trim().replace(/^u\//, '')
    return {
        requestBelt: form.requestBelt,
        entries,
        quests,
        ...(isDan && {danRequestEvidence: form.danRequestEvidence}),
        ...(form.blueBeltProjectInfo && {blueBeltProjectInfo: form.blueBeltProjectInfo}),
        ...(form.blackBeltMentoringInfo && {blackBeltMentoringInfo: form.blackBeltMentoringInfo}),
        ...(form.notes && {notes: form.notes}),
        ...(sync && {redditUsername: sync})
    }
}

export function saveDiscordBeltRequestDraft({uid, form, lockCount, questCount}) {
    sessionStorage.setItem(draftKey, JSON.stringify({uid, form, lockCount, questCount, savedAt: Date.now()}))
}

export function readDiscordBeltRequestDraft(uid) {
    let draft
    try {
        draft = JSON.parse(sessionStorage.getItem(draftKey))
    } catch {
        sessionStorage.removeItem(draftKey)
        return null
    }
    if (!draft) return null
    if (draft.uid !== uid || !draft.form || typeof draft.form !== 'object' ||
        !Number.isInteger(draft.lockCount) || draft.lockCount < 0 || draft.lockCount > 6 ||
        !Number.isInteger(draft.questCount) || draft.questCount < 0 || draft.questCount > 2 ||
        !Number.isFinite(draft.savedAt) || draft.savedAt > Date.now() ||
        Date.now() - draft.savedAt > draftLifetimeMs) {
        sessionStorage.removeItem(draftKey)
        return null
    }
    return draft
}

export function clearDiscordBeltRequestDraft() {
    sessionStorage.removeItem(draftKey)
}
