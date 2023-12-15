import * as React from 'react';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FilterContext from '../contexts/FilterContext'
import useWindowSize from '../util/useWindowSize'
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import SortButton from "../filters/SortButton.jsx";
import {styled} from "@mui/material/styles";
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import {useCallback, useContext, useState} from "react";

console.log('here')

export default function InlineCollectionSelect() {
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {filters} = useContext(FilterContext)
    const [collection, setCollection] = React.useState('');
    const [open, setOpen] = React.useState(false);

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

    const setUp = () => {
        console.log(currentCollection)
        //setCollection('Own')
    }

    const {setFilters, removeFilters} = useContext(FilterContext)

    const handleFilter = (filterKey, filterValue) => {
        setFilters({
            [filterKey]: filterValue,
            tab: 'search'
        })
    }

    const handleChange = (event) => {
        console.log(event.target.value)
        handleFilter('collection', event.target.value)
        setCollection(event.target.value);
    }

    setUp()

    return (
        <div>
            <FormControl fullWidth size="small" sx={{marginLeft:'8px', minWidth: 80, maxWidth: 300}}>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={currentCollection}
                    label=""
                    onChange={handleChange}
                    style={{backgroundColor:'#222', fontSize:'1.1rem', fontWeight:500}}
                >
                    <MenuItem value='Own'>Own</MenuItem>
                    <MenuItem value='Picked'>Picked</MenuItem>
                    <MenuItem value='Recorded'>Recorded</MenuItem>
                    <MenuItem value='Wishlist'>Wishlist</MenuItem>
                </Select>
            </FormControl>
            <SortButton/>
        </div>
    );
}