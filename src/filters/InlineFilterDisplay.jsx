import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import React, {useCallback, useContext} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AuthContext from '../contexts/AuthContext'
import DBContext from '../contexts/DBContext'
import {validCollectionTypes} from '../data/collectionTypes'
import FilterDisplay from './FilterDisplay'
import FilterContext from '../contexts/FilterContext'
import ClearFiltersButton from './ClearFiltersButton'
import useWindowSize from '../util/useWindowSize'

function InlineFilterDisplay() {
    const {isLoggedIn} = useContext(AuthContext)
    const {filters, filterCount, setFilters} = useContext(FilterContext)
    const {anyCollection, lockCollection} = useContext(DBContext)
    const [open, setOpen] = React.useState(false)

    const {collection} = filters
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleFilter = useCallback((filterKey, filterValue) => {
        setFilters({
            [filterKey]: filterValue,
            tab: 'search'
        })
    }, [setFilters])

    const handleChange = useCallback(event => {
        handleFilter('collection', event.target.value)
    }, [handleFilter])

    if (!filterCount) return null
    const isValidCollection = isLoggedIn && typeof collection === 'string' &&
        validCollectionTypes.includes(collection) && filterCount === 1

    return (
        <Card style={style} sx={{paddingBottom: 0, paddingTop: 0}}>
            <CardHeader
                title={isValidCollection ? 'My Collection' : 'Filters'}
                action={<ClearFiltersButton/>}
            />
            <CardContent style={{paddingTop: 0, paddingLeft: 8}}>
                {
                    isValidCollection &&
                    <FormControl fullWidth size='small' sx={{marginLeft: '8px', minWidth: 80, maxWidth: 300}}>
                        <Select
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={currentCollection}
                            onChange={handleChange}
                            style={{backgroundColor: '#222', fontSize: '1.1rem', fontWeight: 500}}
                        >
                            {validCollectionTypes.map((list, index) =>
                                <MenuItem key={index} value={list}>
                                    {list} ({list === 'Any' ? anyCollection.length : lockCollection[list.toLowerCase()]?.length || 0})
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                }
                {
                    !isValidCollection &&
                    <FilterDisplay/>
                }
            </CardContent>
        </Card>
    )
}

export default InlineFilterDisplay
