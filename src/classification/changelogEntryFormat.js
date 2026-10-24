import entryName from '../entries/entryName.js'

export default function changelogEntryFormat({entry, adminAction, targetLock, linebreak, historical = false}) {
    const {action, samelineLock, samelineTargetName, newSamelineName, updatedBelt, previousBelt, note} = adminAction

    const targetName = targetLock
        ? entryName(targetLock, 'short', {includeVersion: true})
        : samelineTargetName ?? samelineLock?.lockFullName
    const targetBelt = targetLock?.belt ?? samelineLock?.belt

    const name = historical ? adminAction.entryName ?? entryName(entry, 'short') : entryName(entry, 'short')
    const version = entry.version ? ` - ${entry.version}` : ''
    const separator = linebreak ? '\n\n' : ' - '

    let entryText = `- **${name}**${version}${separator}${updatedBelt?.toUpperCase() ?? ''}. ${note ?? ''}`

    if (action === 'Sameline') {
        entryText = `- **${name}**${version}${separator}sameline with **${targetName}**${targetBelt ? ` at ${targetBelt.toUpperCase()}` : ''}. ${note ?? ''}`
    }
    if (action === 'Add New Sameline') {
        const belt = historical ? previousBelt ?? entry.belt : entry.belt
        entryText = `- **${newSamelineName}**${separator}sameline with **${name}**${version}${belt ? ` at ${belt.toUpperCase()}` : ''}. ${note ?? ''}`
    }
    if (action === 'Delete') {
        entryText = `- **${name}**${version}${separator}${historical ? previousBelt ?? entry.belt : entry.belt}. ${note ?? ''}`
    }
    if (action === 'Other') {
        entryText = `- **${name}**${version}${separator}${historical ? previousBelt ?? entry.belt : entry.belt}. ${note ?? ''}`
    }
    return entryText
}
