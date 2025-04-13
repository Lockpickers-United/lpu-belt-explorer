import React, {useContext, useCallback, useState, useRef, useEffect, useMemo} from 'react'
import useData from '../util/useData.jsx'
import Footer from '../nav/Footer.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import SignInButton from '../auth/SignInButton.jsx'
import Button from '@mui/material/Button'
import {Outlet} from 'react-router-dom'
import Nav from '../nav/Nav.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from '../locks/LockDataProvider.jsx'
import {collection, onSnapshot, query, where} from 'firebase/firestore'
import {db} from '../auth/firebase'

function RankingRequestsParentRoute() {
    const {user} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)

    const [requestData, setRequestData] = useState([])
    const totalReadCount = useRef(0)

    useEffect(() => {
        const q = query(
            collection(db, 'ranking-requests'),
            where('requestStatus', '!=', 'Deleted')
        )
        const unsubscribe = onSnapshot(
            q,
            snapshot => {
                const docsRead = snapshot.docs.length
                totalReadCount.current += docsRead
                console.log(
                    `Snapshot received: ${docsRead} documents read. Cumulative reads: ${totalReadCount.current}`
                )

                setRequestData(prevRequests => {
                    const currentRequests = new Map(prevRequests.map(doc => [doc.id, doc]))
                    snapshot.docChanges().forEach(change => {
                        const docData = {id: change.doc.id, ...change.doc.data()}

                        if (change.type === 'added') {
                            console.log(`Document added: ${docData.id}`)
                            if (!currentRequests.has(docData.id)) {
                                currentRequests.set(docData.id, docData)
                            }
                        } else if (change.type === 'modified') {
                            console.log(`Document modified: ${docData.id}`)
                            currentRequests.set(docData.id, docData)
                        } else if (change.type === 'removed') {
                            console.log(`Document removed: ${docData.id}`)
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
        // Clean up the listener on component unmount
        return () => unsubscribe()
    }, [])

    const rankingRequests = useMemo(() => {
        return requestData
            .filter(request => request.makeModels && request.makeModels[0].make && request.makeModels[0].model)
    },[requestData])

    const userId = user ? user.uid : null
    const loadFn = useCallback(async () => {
        if (!userId) return null
        try {
            return await getProfile(userId)
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])
    const {data = {}, loading, error} = useData({loadFn})

    return (
        <React.Fragment>
            {loading && <LoadingDisplay/>}

            {!loading && data && !error &&
                <Outlet context={rankingRequests} />
            }

            {!loading && !data && !error && !user &&
                <FilterProvider>
                    <DataProvider allEntries={[]}>
                        <Nav title='Please Sign In'/>

                        <div style={{
                            maxWidth: 700, padding: 0,
                            marginLeft: 'auto', marginRight: 'auto', marginTop: 46, marginBottom: 46
                        }}>
                            <div style={{textAlign: 'center', marginTop: 40}}>
                                We&#39;re sorry, you must be signed in to request locks.
                                <br/><br/>
                                <Button style={{color: '#fff'}}>
                                    <SignInButton/>
                                </Button>
                            </div>
                        </div>
                    </DataProvider>
                </FilterProvider>
            }
            <Footer/>
        </React.Fragment>
    )
}

export default RankingRequestsParentRoute