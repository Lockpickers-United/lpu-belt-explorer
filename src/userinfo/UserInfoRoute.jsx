import React, {useContext} from 'react'
import UserInfoMain from './UserInfoMain.jsx'
import {ProfileDataProvider} from '../app/ProfileDataContext.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Nav from '../nav/Nav.jsx'

function UserInfoRoute() {
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
                <ProfileDataProvider>
                    <UserInfoMain/>
                </ProfileDataProvider>
            }

        </FilterProvider>
    )
}

export default UserInfoRoute
