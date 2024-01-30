import React, {useContext, useEffect, useMemo, useState} from 'react'
import {useParams} from 'react-router-dom'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import {collectionOptions} from '../data/collectionTypes'
import allEntries from '../data/data.json'
import FilterButton from '../filters/FilterButton'
import {DataProvider} from '../locks/DataContext'
import {FilterProvider} from '../locks/FilterContext'
import {LockListProvider} from '../locks/LockListContext'
import ToggleCompactButton from '../locks/ToggleCompactButton'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import ProfileNotFound from './ProfileNotFound'
import ProfilePage from './ProfilePage'

function ProfileRoute() {
    const [data, setData] = useState({})
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
                setData({})
                setError(true)
            }
        }

        load()
    }, [userId, getProfile])

    const entries = useMemo(() => {
        const uniqueIds = new Set(collectionOptions
            .flatMap(({key}) => data[key]))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [data])

    const nav = (
        <React.Fragment>
            <FilterButton/>
            <ToggleCompactButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <FilterProvider>
                <DataProvider allEntries={entries} profile={data}>
                    <LockListProvider>
                        <Nav title={`Profile for ${data.displayName || 'Anonymous'}`} extras={nav}/>

                        {data && !error && <ProfilePage profile={data}/>}
                        {error && <ProfileNotFound/>}

                        <Footer/>

                        <Tracker feature='profile'/>
                    </LockListProvider>
                </DataProvider>
            </FilterProvider>
        </React.Fragment>
    )
}

export default ProfileRoute
