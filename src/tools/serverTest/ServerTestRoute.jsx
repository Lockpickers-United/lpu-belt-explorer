import React, {useContext} from 'react'
import ServerTestMain from './ServerTestMain.jsx'
import {ProfileProvider} from '../../app/ProfileContext.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import AuthContext from '../../app/AuthContext.jsx'
import DBContext from '../../app/DBContext.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import Nav from '../../nav/Nav.jsx'

export default function ServerTestRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {dbLoaded} = useContext(DBContext)
    const title = !authLoaded || !dbLoaded ? 'Loading...' : 'User Info'

    return (
        <FilterProvider filterFields={[]}>

            <Nav title={title}/>

            {(!authLoaded || !dbLoaded) &&
                <LoadingDisplay/>
            }
            {authLoaded && dbLoaded &&
                <ProfileProvider>
                    <ServerTestMain/>
                </ProfileProvider>
            }

        </FilterProvider>
    )
}
