import React, {useCallback, useContext, useDeferredValue, useMemo, useState} from 'react'
import DataContext from '../../context/DataContext.jsx'
import NoEntriesCard from '../../locks/NoEntriesCard.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import RaffleEntry from '../RaffleEntry.jsx'
import RaffleExportButton from '../RaffleExportButton.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

function RafflePotPreviewEntries({drawing = false}) {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries = [], expandAll} = useContext(DataContext)

    const navigate = useNavigate()
    const defExpanded = useDeferredValue(expanded)
    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const sortEntries = useMemo(() => {
        return visibleEntries.sort((a, b) => a.contributedBy[0].localeCompare(b.contributedBy[0]) || a.title.localeCompare(b.title))
    }, [visibleEntries])


    const linkSx = {
        color: '#bbb', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500, '&:hover': {
            color: '#fff'
        }
    }

    return (

        <div style={{paddingBottom: 32}}>

            <div style={{fontSize: '1.7rem', fontWeight: 600, margin: '20px 0px'}}>
                Pot <Link onClick={() => navigate('/rafl/contribute')} sx={linkSx}>Info</Link> |
                &nbsp;<Link onClick={() => navigate('/rafl/photos')} sx={linkSx}>Photos</Link> |
                &nbsp;Preview
            </div>

            <div style={{fontSize: '1.2rem', fontWeight: 400, margin: '20px 0px'}}>
                <strong>Please note:</strong> newly submitted pots and photos will not appear until they
                are manually added to the database.
            </div>
            {visibleEntries.length === 0 && <NoEntriesCard label='Rafl Pots'/>}

            {sortEntries.map(entry =>
                <RaffleEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded || !!expandAll}
                    drawing={drawing}
                />
            )}

            <div style={{marginLeft: 'auto', marginRight: 'auto', justifyItems: 'center', marginTop: 30}}>
                <RaffleExportButton text={true}/>
            </div>

        </div>
    )
}

export default RafflePotPreviewEntries
