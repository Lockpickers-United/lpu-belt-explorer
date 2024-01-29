import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import DBContext from '../app/DBContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import ProfileNotFound from './ProfileNotFound'
import ProfilePage from './ProfilePage'

function ProfileRoute() {
    const [data, setData] = useState()
    const {userId} = useParams()
    const {getProfile} = useContext(DBContext)
    const [error, setError] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const value = await getProfile(userId)
                setData(value)
                setError(false)
            } catch (ex) {
                console.trace('Error loading profile', ex)
                setData(null)
                setError(true)
            }
        }

        load()
    }, [userId, getProfile])

    return (
        <React.Fragment>
            <Nav title='Profile'/>

            {data && !error && <ProfilePage data={data}/>}
            {error && <ProfileNotFound/>}

            <Footer/>
        </React.Fragment>
    )
}

export default ProfileRoute
