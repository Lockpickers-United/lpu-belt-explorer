import React, {useCallback, useContext, useMemo} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import {useLocalStorage} from 'usehooks-ts'

const SystemMessageContext = React.createContext({})

export function SystemMessageProvider({children}) {
    const {authLoaded, user, isLoggedIn} = useContext(AuthContext)
    const {dbLoaded, adminRole, lockCollection, addToLockCollection, systemMessages, } = useContext(DBContext)
    const profile = lockCollection
    const [dismissedMessages, setDismissedMessages] = useLocalStorage('dismissedMessages', [])

    const dismissMessage = useCallback(async (message) => {
        if (isLoggedIn) {
            await addToLockCollection('dismissedMessages', message?.id)
        } else {
            const newMessages = [...dismissedMessages, message?.id]
            setDismissedMessages(newMessages)
        }
    }, [addToLockCollection, dismissedMessages, isLoggedIn, setDismissedMessages])

    const filteredMessages = useMemo(() => systemMessages.map(message => {

            const profileMessages = profile?.dismissedMessages || []
            const allDismissedMessages = [...new Set([...profileMessages, ...dismissedMessages])]

            let valid = 1
            if (message['targetAnonymousNotOK']) {
                valid = !profile?.privacyAnonymous ? valid : 0
            }
            if (message['targetAdminOnly']) {
                valid = adminRole ? valid : 0
            }
            if (message['targetLoggedIn']) {
                valid = user ? valid : 0
            }
            if (message['targetCollectionUsersOnly']) {
                valid = profile?.any?.length > 0 ? valid : 0
            }
            if (message['targetBlackBeltsOnly']) {
                valid = profile?.blackBeltAwardedAt > 0 ? valid : 0
            }
            if (message['targetUserIds']) {
                valid = message['targetUserIds'].includes(user?.uid) ? 1 : 0
            }
            if (!message['noDismiss'] && !message['ignoreDismiss']) {
                valid = !allDismissedMessages.includes(message.id) ? valid : 0
            }

            const thisMessage = {...message}
            thisMessage.priority = message['targetUserIds'] ? message.priority * 2 : message.priority
            return valid === 1 ? thisMessage : undefined
        })
            .filter(x => x)
            .sort((a, b) => {
                return b.priority - a.priority
            })
        , [dismissedMessages, systemMessages, profile, user, adminRole])

    const getMessage = useCallback((location) => {
        const baseDir = /\/\w*\//.test(location) ? /\/\w*\//.exec(location)[0] + '*' : location + '/*'
        const noId = location.replace(/\/\w{28}/, '')
        const pageIds = ['*', location, baseDir, noId]

        return filteredMessages && authLoaded && dbLoaded
            ? filteredMessages.find(message => {
                    const excludedPages = message.excludePageIds
                        ? [message.linkDestination, ...message.excludePageIds]
                        : [message.linkDestination]
                    return message?.pageIds?.some(r => pageIds.includes(r)) && !excludedPages.some(r => pageIds.includes(r))
                }
            )
            : undefined
    }, [authLoaded, filteredMessages, dbLoaded])


    const value = useMemo(() => ({
        getMessage, dismissMessage
    }), [
        getMessage, dismissMessage
    ])

    return (
        <SystemMessageContext.Provider value={value}>
            {children}
        </SystemMessageContext.Provider>
    )
}

export default SystemMessageContext
