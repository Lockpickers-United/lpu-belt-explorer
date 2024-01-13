import React, {useCallback, useState} from 'react'
import BrandBeltWaffle from './BrandBeltWaffle.jsx'
import brandBeltData from '../data/statsBrandBelts.json'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import useWindowSize from '../util/useWindowSize.jsx'

function BrandBeltStats() {
    const brandBelts = brandBeltData
    const brandNameList = brandBelts.map((brand) =>
        brand.brandName
    )
    const [brandIndex, setBrandIndex] = useState(2)
    const [brandName, setBrandName] = useState(brandBelts[brandIndex].brandName)
    const beltData = brandBelts[brandIndex].data

    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700
    const buttonMargin = !midWidth ? 20 : !smallWidth ? 10 : 2

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleChange = useCallback(event => {
        setBrandIndex(brandNameList.findIndex(x => x === event.target.value))
        setBrandName(event.target.value)
        handleClose()

        // TODO: deselect to restore display of 'Brand' header and border?
        document.getElementById('brandPulldown').classList.remove('active')
        document.getElementById('brandSelect').classList.remove('active')
    }, [brandNameList, handleClose])

    return (
        <React.Fragment>
            <div style={{marginTop: 24, textAlign: 'center'}}>
                <FormControl id='brandPulldown' style={{marginBottom: buttonMargin, minWidth: 200, textAlign: 'left'}}>
                    <InputLabel>Brand</InputLabel>
                    <Select
                        id='brandSelect'
                        value={brandName}
                        label='Brand'
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        onChange={handleChange}
                    >
                        {brandNameList.map((brand, index) =>
                            brand === 'Top Brands' && <MenuItem disabled key={index} value={brand}>{brand}</MenuItem>
                            || brand === 'All Brands' && <MenuItem disabled key={index} value={brand}>{brand}</MenuItem>
                            || brand === 'divider' && <Divider key={index}/>
                            || <MenuItem key={index} value={brand}>{brand}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </div>
            <BrandBeltWaffle beltData={beltData} brandName={brandName}/>
        </React.Fragment>
    )
}

export default BrandBeltStats
