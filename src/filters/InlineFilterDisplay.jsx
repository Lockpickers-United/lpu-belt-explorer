import React, {useCallback, useContext} from 'react'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {useParams} from 'react-router-dom'
import collectionOptions from '../data/collectionTypes'
import FilterDisplayExclude from './FilterDisplayExclude'
import FilterContext from '../context/FilterContext'
import ClearFiltersButton from './ClearFiltersButton'
import useWindowSize from '../util/useWindowSize'
import InputLabel from '@mui/material/InputLabel'
import Link from '@mui/material/Link'
import DataContext from '../context/DataContext.jsx'

function InlineFilterDisplay({profile = {}, collectionType, advancedEnabled}) {
    const {userId} = useParams()
    const {filters, filterCount, addFilter, setShowAdvancedSearch, showAdvancedSearch} = useContext(FilterContext)
    const {visibleEntries = []} = useContext(DataContext)

    const [open, setOpen] = React.useState(false)

    const collectionLabels = collectionOptions[collectionType]?.labels || []
    const collectionKeyByLabel = collectionOptions[collectionType]?.keyByLabel || []
    const collectedLocks = collectionOptions[collectionType]?.getCollected(profile) || []

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const {collection = (userId && filterCount === 0 ? 'Any' : null)} = filters
    const isValidCollection = collectionLabels.includes(collection) && filterCount < 2

    let currentCollection = ''
    if (collection) {
        if (typeof collection === 'string') {
            currentCollection = collection
        } else {
            currentCollection = 'Any'
        }
    }

    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        addFilter('collection', event.target.value, true)
    }, [addFilter])

    const handleToggleAdvanced = useCallback(() => {
        setShowAdvancedSearch(!showAdvancedSearch)
    }, [setShowAdvancedSearch, showAdvancedSearch])

    if (!filterCount && !userId) return null

    const paddingLeft = isMobile ? 8 : 16

    const linkSx = {
        color: '#ddd', textDecoration: 'underline', cursor: 'pointer', '&:hover': {
            color: '#fff', fontSize: '0.9rem'
        }
    }

    return (
        <Card style={style} sx={{paddingBottom: 0, paddingTop: 2}}>
            <CardContent style={{paddingTop: 0, paddingLeft: paddingLeft}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{fontWeight: 700, fontSize: '1.2rem'}}>Current Filters</div>
                    {visibleEntries.length > 1 &&
                        <div style={{
                            fontWeight: 400,
                            fontSize: '1.0rem',
                            marginLeft: 8
                        }}>({visibleEntries.length} Locks)</div>
                    }
                    {advancedEnabled &&
                        <div style={{flexGrow: 1, textAlign: 'right', fontSize: '0.9rem'}}>
                            <Link onClick={handleToggleAdvanced} sx={linkSx}>Advanced</Link>
                        </div>
                    }
                </div>

                {
                    isValidCollection &&
                    <div style={{display: 'flex'}}>
                        <FormControl fullWidth size='small' color='secondary'
                                     sx={{marginLeft: '8px', minWidth: 80, maxWidth: 300}}>
                            <InputLabel id={'label'}>Collection</InputLabel>
                            <Select
                                name='collection-selector'
                                label={'Collection'}
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={currentCollection}
                                onChange={handleChange}
                                style={{backgroundColor: '#222', fontSize: '1.1rem', fontWeight: 500}}
                                color='secondary'
                            >
                                {collectionLabels.map((list, index) =>
                                    <MenuItem key={index} value={list}>
                                        {list} ({list === 'Any' ? collectedLocks.length : profile[collectionKeyByLabel[list]]?.length || 0})
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <div style={{flexGrow: 1, marginTop: 2, marginLeft: 15}}>
                            <ClearFiltersButton/>
                        </div>
                    </div>
                }
                {!isValidCollection &&
                    <FilterDisplayExclude/>
                }
            </CardContent>
        </Card>
    )
}

export default InlineFilterDisplay
