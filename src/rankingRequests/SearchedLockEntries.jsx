import React, {useCallback, useContext, useMemo} from 'react'
import searchEntriesForText from '../filters/searchEntriesForText'
import entryName from '../entries/entryName'
import DataContext from '../context/DataContext.jsx'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'

export default function SearchedLockEntries({entry, requestMod}) {

    const navigate = useNavigate()

    const handleClick = useCallback((e, path) => {
        e.stopPropagation()
        e.preventDefault()
        navigate(path)
    }, [navigate])

    if (!requestMod) return null
    //if (entry.requestStatus === 'Ranked') return null

    const {lockEntries} = useContext(DataContext)
    const searchedEntries = useMemo(() => {
        return searchEntriesForText(entryName(entry), [...lockEntries])
    }, [entry, lockEntries]).slice(0, 3)

    if (!searchedEntries.length) return null

    const lockLinks = searchedEntries.map(lock => {
        const name = entryName(lock)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `/locks?tab=search&search=${lock.id}&id=${lock.id}&name=${safeName}`
        return <div key={lock.id}>• <Link
            onClick={(e) => handleClick(e, link)}
            style={{textDecoration: 'none', color: (entry.requestStatus === 'Ranked') ? '#aaa' : '#ddf'}}>
            {name} || {lock.belt}</Link></div>
    })

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 20,
        marginBottom: 5,
        width: '100%',
        fontSize: '0.9rem'
    }}>
        <strong>Possible matches:</strong>
        {lockLinks.map(link =>
            link
        )}
    </div>
    
}
