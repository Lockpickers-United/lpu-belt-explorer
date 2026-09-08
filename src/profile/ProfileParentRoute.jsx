import React from 'react'
import {Outlet, useParams} from 'react-router-dom'
import {ProfileProvider} from '../app/ProfileContext.jsx'

export default function ProfileParentRoute() {
    const {userId} = useParams()

    return (
        <ProfileProvider userId={userId}>
            <Outlet/>
        </ProfileProvider>
    )
}
