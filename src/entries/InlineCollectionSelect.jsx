import * as React from 'react'
import FilterContext from '../contexts/FilterContext'
import useWindowSize from '../util/useWindowSize'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import SortButton from '../filters/SortButton.jsx'
import Select from '@mui/material/Select'
import DBContext from '../contexts/DBContext.jsx'
import {useContext} from 'react'

export default function InlineCollectionSelect() {
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {filters} = useContext(FilterContext)
    const [collection, setCollection] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const {lockCollection} = useContext(DBContext)
    const {setFilters, removeFilters} = useContext(FilterContext)
    const {filterCount} = useContext(FilterContext)

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const handleFilter = (filterKey, filterValue) => {
        setFilters({
            [filterKey]: filterValue,
            tab: 'search'
        })
    }

    const handleChange = (event) => {
        handleFilter('collection', event.target.value)
        setCollection(event.target.value)
    }

    const collectionsList = ['Own', 'Picked', 'Recorded', 'Wishlist']

    if (!currentCollection || filterCount > 1) return null
    if (!currentCollection.match(/^(Own|Picked|Recorded|Wishlist)$/)) return null
    return (
        <div style={style}>
            <FormControl fullWidth size='small' sx={{marginLeft: '8px', minWidth: 80, maxWidth: 300}}>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={currentCollection}
                    label=''
                    onChange={handleChange}
                    style={{backgroundColor: '#222', fontSize: '1.1rem', fontWeight: 500}}
                >
                    {collectionsList.map((list, index) =>
                        <MenuItem key={index}
                                  value={list}>{list} ({lockCollection[list.toLowerCase()]?.length})</MenuItem>
                    )}
                </Select>
            </FormControl>
            <SortButton/>
        </div>
    )
}