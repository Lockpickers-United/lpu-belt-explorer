import entryName from '../entries/entryName.js'

export default function changelogEntryFormat({entry, adminAction, targetLock, linebreak}) {
    const {action, samelineLock, updatedBelt, note} = adminAction

    const targetName = targetLock
        ? entryName(targetLock, 'short', {includeVersion: true})
        : samelineLock?.lockFullName
    const targetBelt = targetLock?.belt ?? samelineLock?.belt

    const name = entryName(entry, 'short')
    const version = entry.version ? ` - ${entry.version}` : ''
    const separator = linebreak ? '\n\n' : ' - '

    let entryText = `- **${name}**${version}${separator}${updatedBelt?.toUpperCase()}. ${note}`

    if (action === 'Sameline') {
        entryText = `- **${name}**${version}${separator}sameline with **${targetName}** at ${targetBelt?.toUpperCase()}. ${note}`
    }
    if (action === 'Delete') {
        entryText = `- **${name}**${version}${separator}${entry.belt}. ${note}`
    }
    return entryText
}
