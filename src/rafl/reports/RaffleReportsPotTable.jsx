import React, {useCallback, useContext, useState} from 'react'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import RaffleAutocompleteBox from '../entryForm/RaffleAutocompleteBox.jsx'
import useData from '../../util/useData.jsx'
import {raflCollectionDetails} from '../../data/dataUrls'
import RaffleContext from '../RaffleContext.jsx'
import DataTableSort from '../../misc/DataTableSort.jsx'

const RaffleReportsPotTable = ({statsData}) => {
    const {allPots} = useContext(RaffleContext)
    const {potViewsById} = statsData
    const {data} = useData({url: raflCollectionDetails})
    const {potWatches} = data || {}
    const navigate = useNavigate()

    const columns = [
        {name: 'Pot #', align: 'center', id: 'potNumber'},
        //{name: 'ID', align: 'center', id: 'id'},
        {id: 'title', align: 'left', name: 'Title'},
        {id: 'views', align: 'center', name: 'Views', descending: true},
        //{id: 'percentViews', name: '% Views', align: 'center'},
        {id: 'uniqueDonorCount', name: 'Donors', align: 'center', descending: true},
        {id: 'totalTickets', name: 'Tickets', align: 'center', descending: true},
        {id: 'watchlists', name: 'Watchlists', align: 'center', descending: true}
    ]

    const [searched, setSeached] = useState({})

    const potData = allPots.map(pot => {
        const dataPot = allPots.find(p => p.id === pot.id) || {}
        if (!dataPot) return null
        const statsPot = potViewsById.data.find(p => p.id === pot.id) || {}

        pot = {
            ...pot,
            views: statsPot.views || 0,
            percentViews: statsPot.percentViews || 0,
            uniqueDonorCount: statsPot.uniqueDonorCount || 0,
            totalTickets: statsPot.totalTickets || 0
        }

        // Shorten long titles
        let potTitle = dataPot?.title ? dataPot.title.substring(0,28) : `unknown (${pot.id})`
        potTitle = dataPot?.title?.length < 28 || !dataPot?.title ? potTitle : potTitle + '...'

        const id = pot?.id?.replace('2025-', '')
        return {
            ...pot,
            ...dataPot,
            title: potTitle,
            id: id,
            watchlists: potWatches?.[pot.id] || 0,
            percentViews: (Math.floor(pot.percentViews * 100) + '%'),
        }
    }).filter(x => x)

    const searchedRows = Object.keys(searched).length > 0
        ? [potData?.find(pot => pot.title === searched.itemTitle)] || []
        : potData || []

    const rows = searchedRows.map(row => {
        return row.donors && row.donors > 0
            ? {...row}
            : {...row, donors: 0, tickets: 0}
    })

    const defaultSort = 'potNumber'
    const tableData = {columns, rows, defaultSort, sortable: true}

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

    const tableWidth = '100%'

    return (
        <div>

            <div style={{justifyItems: 'center', marginBottom: 20}}>
                <div style={{width:400}}>
                    <RaffleAutocompleteBox allItems={potData}
                                           value={searched.itemTitle || null}
                                           setItemDetails={setSeached}
                                           getOptionTitle={potTitle}
                                           searchText={'Search Pots'}
                    />
                </div>
            </div>

            <DataTableSort tableData={tableData} tableWidth={tableWidth} linkFunction={linkFunction}/>

        </div>

    )
}

export default RaffleReportsPotTable
