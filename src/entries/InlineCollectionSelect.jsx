import * as React from 'react';
import FilterContext from '../contexts/FilterContext'
import useWindowSize from '../util/useWindowSize'
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SortButton from "../filters/SortButton.jsx";
import Select from '@mui/material/Select';
import {useCallback, useContext, useState} from "react";
import DBContext from "../contexts/DBContext.jsx";

export default function InlineCollectionSelect() {
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {filters} = useContext(FilterContext)
    const [collection, setCollection] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const {lockCollection} = useContext(DBContext)

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    if (!currentCollection) return null
    if (currentCollection.includes('Not') || currentCollection.includes("Don't")) return null

    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const {setFilters, removeFilters} = useContext(FilterContext)

    const handleFilter = (filterKey, filterValue) => {
        setFilters({
            [filterKey]: filterValue,
            tab: 'search'
        })
    }

    const handleChange = (event) => {
        handleFilter('collection', event.target.value)
        setCollection(event.target.value);
    }

    const collectionsList = ['Own', 'Picked', 'Recorded', 'Wishlist']

    return (
        <div>
            <FormControl fullWidth size="small" sx={{marginLeft: '8px', minWidth: 80, maxWidth: 300}}>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={currentCollection}
                    label=""
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
    );
}