import React, {useContext} from 'react'
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
import {ProfileDataProvider} from '../app/ProfileDataContext.jsx'

function ContentParentRoute() {
    const {user} = useContext(AuthContext)
    const {dbLoaded} = useContext(DBContext)

    return (
        <React.Fragment>
            {!dbLoaded && <LoadingDisplay/>}

            {dbLoaded && user &&
                <ProfileDataProvider>
                    <Outlet context={{user}}/>
                </ProfileDataProvider>
            }

            {dbLoaded && !user &&
                <FilterProvider>
                    <DataProvider allEntries={[]}>
                        <Nav title='Please Sign In'/>

                        <div style={{
                            maxWidth: 700, padding: 0,
                            marginLeft: 'auto', marginRight: 'auto', marginTop: 46, marginBottom: 46
                        }}>
                            <div style={{textAlign: 'center', marginTop: 40}}>
                                We&#39;re sorry, you must be signed in to submit content.
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

export default ContentParentRoute