import React, {useContext, useMemo} from 'react'
import searchEntriesForText from '../filters/searchEntriesForText'
import entryName from '../entries/entryName'
import DataContext from '../context/DataContext.jsx'

export default function SearchedLockEntries({entry, requestMod}) {

    if (!requestMod) return null
    //if (entry.requestStatus === 'Ranked') return null

    const {lockEntries} = useContext(DataContext)
    const searchedEntries = useMemo(() => {
        return searchEntriesForText(entryName(entry), [...lockEntries])
    }, [entry, lockEntries]).slice(0, 3)

    if (!searchedEntries.length) return null

    const lockLinks = searchedEntries.map(entry => {
        const name = entryName(entry)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `https://lpubelts.com/#/locks?tab=search&search=${entry.id}&id=${entry.id}&name=${safeName}`
        return <div key={entry.id}>• <a href={link}>{name} || {entry.belt}</a></div>
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
