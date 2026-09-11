import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ViewLockRequests from './ViewLockRequests.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../data/filterFields'
import AuthContext from '../app/AuthContext.jsx'
import {collection, onSnapshot, query, where} from 'firebase/firestore'
import {db, devFirestore} from '../auth/firebase'
import postFirebaseActivity from './postFirebaseActivity'
import ProfileLoader from '../auth/ProfileLoader.jsx'
import ProfileContext from '../app/ProfileContext.jsx'

export default function ViewLockRequestsRoute() {
    usePageTitle('View Lock Requests')

    const {user, userClaims, isLoggedIn} = useContext(AuthContext)
    const {data, loading, error} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    const requestMod = ['requestAdmin', 'admin'].some(claim => userClaims.includes(claim))
    const {isMobile} = useWindowSize()

    const [requestData, setRequestData] = useState([])
    const totalReadCount = useRef(0)

    useEffect(() => {
        const q = query(
            collection(db, 'ranking-requests'),
            where('requestStatus', '!=', 'Deleted')
        )
        const unsubscribe = isLoggedIn
            ? onSnapshot(
                q,
                snapshot => {
                    const docsRead = snapshot.docs.length
                    const type = totalReadCount.current === 0 ? 'READ' : 'REFRESH'
                    totalReadCount.current += docsRead
                    const activityData = [{
                        type,
                        count: docsRead,
                        source: 'request-subscription',
                        id: '',
                        displayName: profile?.displayName,
                        prod: !devFirestore
                    }]

                    postFirebaseActivity({activityData})

                    setRequestData(prevRequests => {
                        const currentRequests = new Map(prevRequests.map(doc => [doc.id, doc]))
                        snapshot.docChanges().forEach(change => {
                            const docData = {id: change.doc.id, ...change.doc.data()}
                            if (change.type === 'added') {
                                if (!currentRequests.has(docData.id)) {
                                    currentRequests.set(docData.id, docData)
                                }
                            } else if (change.type === 'modified') {
                                currentRequests.set(docData.id, docData)
                            } else if (change.type === 'removed') {
                                currentRequests.delete(docData.id)
                            }
                        })
                        return Array.from(currentRequests.values())
                    })
                },
                error => {
                    console.error('Error getting ranking requests from DB:', error)
                }
            )
            : (() => {
            })

        // Clean up the listener on component unmount
        return () => unsubscribe()

    }, [isLoggedIn]) // eslint-disable-line react-hooks/exhaustive-deps

    const rankingRequests = useMemo(() => {
        return requestData
            .filter(request => request.makeModels && request.makeModels[0].make && request.makeModels[0].model)
    }, [requestData])


    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={rankingRequests} profile={profile}>

                <Nav title='View Lock Requests' extras={extras}/>

                <ProfileLoader loading={loading} error={error} required={true} dialogText={'to view lock requests'}/>

                {!loading && !error &&
                    <ViewLockRequests user={user} requestMod={requestMod}/>
                }

            </DataProvider>
        </FilterProvider>
    )
}
