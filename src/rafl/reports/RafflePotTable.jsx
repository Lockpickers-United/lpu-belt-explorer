import React, {useCallback, useContext, useState} from 'react'
import useWindowSize from '../../util/useWindowSize'
import AdminStatsTableSort from '../../admin/AdminStatsTableSort.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import RaffleAutocompleteBox from '../entryForm/RaffleAutocompleteBox.jsx'
import DataContext from '../../context/DataContext.jsx'
import useData from '../../util/useData.jsx'
import {raflCollectionDetails} from '../../data/dataUrls'

const RafflePotTable = ({statsData}) => {
    const navigate = useNavigate()
    const {potViewsById} = statsData
    const {getPotFromId} = useContext(DataContext)
    const {data} = useData({url: raflCollectionDetails})
    const {potWatches} = data || {}

    const columns = [
        {name: 'Pot #', align: 'center', id: 'potNumber'},
        //{name: 'ID', align: 'center', id: 'id'},
        {id: 'title', align: 'left', name: 'Title'},
        {id: 'views', align: 'center', name: 'Views'},
        //{id: 'percentViews', name: '% Views', align: 'center'},
        {id: 'donors', name: 'Donors', align: 'center'},
        {id: 'tickets', name: 'Tickets', align: 'center'},
        {id: 'watchlists', name: 'Watchlists', align: 'center'}
    ]

    const sortable = true
    const [sort, setSort] = useState('potNumber')
    const [ascending, setAscending] = useState(true)
    const [searched, setSeached] = useState({})

    const potData = potViewsById.data.map(pot => {
        const dataPot = getPotFromId(pot.id)

        if (!dataPot) return null

        let potTitle = dataPot?.title ? dataPot.title.substring(0,32) : `unknown (${pot.id})`
        potTitle = dataPot?.title?.length < 32 || !dataPot?.title ? potTitle : potTitle + '...'

        const id = pot?.id?.replace('2025-', '')
        return {
            ...pot,
            percentViews: (Math.floor(pot.percentViews * 100) + '%'),
            ...dataPot,
            title: potTitle,
            id: id,
            watchlists: potWatches?.[pot.id] || 0
        }
    })
        .filter(x => x)
        .sort((a, b) => {
            switch (sort) {
                case 'potNumber':
                    return a['potNumber'] - b['potNumber']
                        || a['title'].localeCompare(b['title'])
                case 'id':
                    return a[sort].localeCompare(b[sort])
                case 'title':
                    return a[sort].localeCompare(b[sort])
                case 'donors':
                    return parseInt(b[sort]) - parseInt(a[sort])
                        || a['title'].localeCompare(b['title'])
                case 'percentViews':
                    return parseInt(b[sort]) - parseInt(a[sort])
                        || a['views'] - (b['views'])
                default:
                    return parseInt(b[sort]) - parseInt(a[sort])
                        || a['title'].localeCompare(b['title'])
            }
        })

    const sortedPots = ascending ? potData : potData.reverse()

    const rows = Object.keys(searched).length > 0
        ? [sortedPots?.find(pot => pot.title === searched.itemTitle)] || []
        : sortedPots || []

    const mappedRows = rows.map(row => {
        return row.donors && row.donors > 0
            ? {...row}
            : {...row, donors: 0, tickets: 0}
    })

    const tableData = {columns: columns, data: mappedRows}

    const linkFunction = useCallback((id, string) => {
        const pot = potData.find(row => row.title === string)
        const safeName = pot?.title.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return id === 'title'
            ? <Link onClick={() => navigate(`/rafl/?id=2025-${pot.id}&name=${safeName}`)}
                    style={{color: '#fff'}}>{string}</Link>
            : string
    }, [navigate, potData])

    const potTitle = useCallback((pot) => {
        return pot?.title ? pot.title : 'unknown'
    }, [])

    const {width} = useWindowSize()
    const mobile360 = width <= 360
    const mobile395 = width <= 395
    const mobile428 = width <= 428  // but test also at 412
    const window560 = width <= 560
    const window820 = width <= 820

    const fontSize = mobile360 ? '.8rem'
        : mobile395 ? '.85rem'
            : mobile428 ? '.9rem'
                : window560 ? '.95rem'
                    : window820 ? '.95rem'
                        : '.95rem'

    const tableWidth = '100%'

    return (
        <div>

            <div style={{justifyItems: 'center', marginBottom: 20}}>
                <div style={{width:400}}>
                    <RaffleAutocompleteBox allItems={potData}
                                           setItemDetails={setSeached}
                                           getOptionTitle={potTitle}
                                           searchText={'Search Pots'}
                    />
                </div>
            </div>

            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={sortable} sort={sort} setSort={setSort}
                                 ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
        </div>

    )
}

export default RafflePotTable
