import React, {useCallback, useContext} from 'react'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import DataContext from '../context/DataContext.jsx'
import DataTableSort from '../misc/DataTableSort.jsx'

const RafflePotTable = ({summary, tableWidth, nameLength}) => {
    const navigate = useNavigate()
    const {getPotFromId} = useContext(DataContext)

    const columns = [
        {id: 'sortPotNumber', align: 'left', name: '#'},
        {id: 'title', align: 'left', name: 'Title'},
        {id: 'uniqueDonorCount', name: 'Donors', align: 'center', descending: true},
        {id: 'totalTickets', name: 'Tickets', align: 'center', descending: true}
    ]
    const data = Object.keys(summary.pots).map(potId => {

        const dataPot = getPotFromId(potId)
        if (!dataPot) return null

        let potTitle = dataPot?.title ? dataPot.title.substring(0, nameLength) : `unknown (${potId})`
        potTitle = dataPot?.title?.length < nameLength || !dataPot?.title ? potTitle : potTitle + '...'
        return {
            ...summary.pots[potId],
            ...dataPot,
            title: potTitle,
            uniqueDonorCount: summary.pots[potId]?.uniqueDonorCount || 0 // TODO: why do I need this???
        }
    }).filter(x => x)

    const rows = data.map(row => {
        return row.donors && row.donors > 0
            ? {...row}
            : {...row, donors: 0, tickets: 0}
    })

    const defaultSort = 'title'
    const tableData = {columns, rows, defaultSort, sortable: true}

    const linkFunction = useCallback((id, string) => {
        const pot = data.find(row => row.title === string)
        const safeName = pot?.title.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return id === 'title'
            ? <Link onClick={() => navigate(`/rafl/?id=${pot.id}&name=${safeName}`)}
                    style={{color: '#fff'}}>{string}</Link>
            : string
    }, [navigate, data])

    return (
        <div>
            <DataTableSort tableData={tableData} tableWidth={tableWidth} linkFunction={linkFunction}/>
        </div>
    )
}

export default RafflePotTable
