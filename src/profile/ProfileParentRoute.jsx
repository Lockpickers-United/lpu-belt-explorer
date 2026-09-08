import React from 'react'
import {Outlet, useParams} from 'react-router-dom'
import {ProfileDataProvider} from '../app/ProfileDataContext.jsx'

export default function ProfileParentRoute() {
    const {userId} = useParams()

    return (
        <ProfileDataProvider userId={userId}>
            <Outlet/>
        </ProfileDataProvider>
    )
}
