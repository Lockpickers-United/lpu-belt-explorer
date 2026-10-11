import entryName from '../entries/entryName.js'
import {useContext} from 'react'
import ClassificationContext from '../app/ClassificationContext.jsx'
import DataContext from '../context/DataContext.jsx'

export default function changelogEntryFormat({entry, currentAction, linebreak}) {
    const {getLockFromId} = useContext(DataContext)
    const {getAdminAction} = useContext(ClassificationContext)
    const adminAction = currentAction ? currentAction : getAdminAction(entry)
    const {action, samelineLock, updatedBelt, note} = adminAction

    const targetLock = samelineLock ? getLockFromId(samelineLock.lockId) : null
    const targetName = targetLock ? entryName(targetLock, 'short', {includeVersion: true}) : null

    const name = entryName(entry, 'short')
    const version = entry.version ? ` - ${entry.version}` : ''
    const separator = linebreak ? '\n\n' : ' - '

    let entryText = `- **${name}**${version}${separator}${updatedBelt?.toUpperCase()}. ${note}`

    if (action === 'Sameline') {
        entryText = `- **${name}**${version}${separator}sameline with **${targetName}** at ${targetLock?.belt?.toUpperCase()}. ${note}`
    }
    if (action === 'Delete') {
        entryText = `- **${name}**${version}${separator}${entry.belt}. ${note}`
    }
    return entryText
}