import React, {useContext, useState, useRef, useEffect, useMemo} from 'react'
import Footer from '../nav/Footer.jsx'
import AuthContext from '../app/AuthContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import SignInButton from '../auth/SignInButton.jsx'
import Button from '@mui/material/Button'
import {Outlet} from 'react-router-dom'
import Nav from '../nav/Nav.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from '../locks/LockDataProvider.jsx'
import {collection, onSnapshot, query, where} from 'firebase/firestore'
import {db, devFirestore} from '../auth/firebase'
import postFirebaseActivity from './postFirebaseActivity'
import DBContext from '../app/DBContext.jsx'

function RankingRequestsParentRoute() {
    const {authLoaded, isLoggedIn} = useContext(AuthContext)
    const {lockCollection} = useContext(DBContext)

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
                    totalReadCount.current += docsRead
                    const activityData = [{
                        activity: 'READ',
                        activityCount: docsRead,
                        source: 'request-subscription',
                        id: '',
                        displayName: lockCollection?.displayName,
                    }]
                    if (totalReadCount.current > docsRead) {
                        activityData.push({
                            activity: 'REFRESH',
                            activityCount: docsRead,
                            source: 'request-subscription',
                            id: '',
                            displayName: lockCollection?.displayName,
                            prod: !devFirestore
                        })
                    }

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
            : (()=>{})

        // Clean up the listener on component unmount
        return () => unsubscribe()

    }, [isLoggedIn]) // eslint-disable-line react-hooks/exhaustive-deps

    const rankingRequests = useMemo(() => {
        return requestData
            .filter(request => request.makeModels && request.makeModels[0].make && request.makeModels[0].model)
    }, [requestData])


    return (
        <React.Fragment>
            {!authLoaded && <LoadingDisplay/>}

            {authLoaded && isLoggedIn &&
                <Outlet context={rankingRequests}/>
            }

            {authLoaded && !isLoggedIn &&
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