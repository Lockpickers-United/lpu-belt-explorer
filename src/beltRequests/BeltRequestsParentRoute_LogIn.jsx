import React, {useContext, useCallback} from 'react'
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

function BeltRequestsParentRoute() {
    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const {adminRole, getProfile} = useContext(DBContext)

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
    const profile = data

    const loggedInUser = !loading && !error && data && isLoggedIn
    const authorizedUser = loggedInUser && (['lpuAdmin', 'admin'].some(claim => userClaims.includes(claim)) || adminRole || true)

    return (
        <React.Fragment>
            {!authLoaded || loading && <LoadingDisplay/>}

            {loggedInUser && authorizedUser &&
                <Outlet context={{profile, user}}/>
            }

            {((!loading && !error && data && !loggedInUser) || !authorizedUser) &&
                <FilterProvider>
                    <DataProvider allEntries={[]}>
                        <Nav title='Not so fast.'/>

                        <div style={{
                            maxWidth: 700, padding: 0,
                            marginLeft: 'auto', marginRight: 'auto', marginTop: 46, marginBottom: 46
                        }}>
                            <div style={{textAlign: 'center', marginTop: 40}}>
                                {!loggedInUser &&
                                    <>
                                        We&#39;re sorry, you must be signed in to submit content.
                                        <br/><br/>
                                        <Button style={{color: '#fff'}}>
                                            <SignInButton/>
                                        </Button>
                                    </>
                                }
                                {loggedInUser && !authorizedUser &&
                                    <>
                                        You are not authorized to use this page.
                                    </>
                                }
                            </div>
                        </div>
                    </DataProvider>
                </FilterProvider>
            }
            <Footer/>
        </React.Fragment>
    )
}

export default BeltRequestsParentRoute