import React, {useCallback, useContext, useMemo} from 'react'
import systemMessages from '../data/systemMessages.json'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'

const SystemMessageContext = React.createContext({})

export function SystemMessageProvider({children}) {
    const {authLoaded, user} = useContext(AuthContext)
    const {dbLoaded, adminRole, lockCollection} = useContext(DBContext)
    const profile = lockCollection

    const filteredMessages = useMemo(() => systemMessages.map(message => {
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
            if (message['targetBlackBeltsOnly']) {
                valid = profile?.blackBeltAwardedAt > 0 ? valid : 0
            }
            if (message['targetUserIds']) {
                valid = message['targetUserIds'].includes(user?.uid) ? 1 : 0
            }
            if (!message['noDismiss'] && !message['ignoreDismiss']) {
                valid = !profile?.dismissedMessages?.includes(message.id) ? valid : 0
            }
            if (!message.active) {
                valid = 0
            }
            const thisMessage = {...message}
            thisMessage.priority = message['targetUserIds'] ? message.priority * 2 : message.priority
            return valid === 1 ? thisMessage : null
        })
            .filter(x => x)
            .sort((a, b) => {
                return b.priority - a.priority
            })
        , [profile, user, adminRole])

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
            : []
    }, [authLoaded, filteredMessages, dbLoaded])


    const value = useMemo(() => ({
        getMessage
    }), [
        getMessage
    ])

    return (
        <SystemMessageContext.Provider value={value}>
            {children}
        </SystemMessageContext.Provider>
    )
}

export default SystemMessageContext
