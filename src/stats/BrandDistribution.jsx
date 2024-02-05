import React, {useCallback, useState} from 'react'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import useWindowSize from '../util/useWindowSize'
import BrandBeltBar from './BrandBeltBar'
import BrandMechanismPie from './BrandMechanismPie'
import statsBrandDistribution from '../data/statsBrandDistribution.json'

function BrandDistribution() {

    const brandData = statsBrandDistribution.brandBelts
    const mechData = statsBrandDistribution.brandMechanisms

    const brandNameBeltList = brandData.map((brand) => brand.brandName)
    const [brandIndex, setBrandIndex] = useState(2)
    const [brandName, setBrandName] = useState(brandData[brandIndex].brandName)

    const brandNameMechList = mechData.map((brand) => brand.brandName)
    const [brandMechIndex, setBrandMechIndex] = useState(2)

    const beltData = brandData[brandIndex].data
    const mechanismData = mechData[brandMechIndex].data

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleChange = useCallback(event => {
        setBrandIndex(brandNameBeltList.findIndex(x => x === event.target.value))
        setBrandMechIndex(brandNameMechList.findIndex(x => x === event.target.value))
        setBrandName(event.target.value)
        handleClose()

        // TODO: deselect to restore display of 'Brand' header and border?
        document.getElementById('brandPulldown').classList.remove('active')
        document.getElementById('brandSelect').classList.remove('active')
    }, [brandNameBeltList, brandNameMechList, handleClose])

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const buttonMargin = !smallWindow ? 20 : 10

    const divStyle = {
        width: '100%', padding: '0px', marginBottom: 12, alignItems: 'center',
        marginLeft: 'auto', marginRight: 'auto'
    }
    const divFlexStyle = !smallWindow ? {display: 'flex'} : {}
    const combinedDivStyle = {
        ...divStyle,
        ...divFlexStyle
    }
    const barDivWidth = !smallWindow ? '55%' : '100%'
    const pieDivWidth = !smallWindow ? '45%' : '100%'

    const barDivHeight = mobileSmall ? 200
        : smallWindow ? 210
            :  180

    const pieDivHeight = mobileSmall ? 120
        : mobileMedium ? 120
            :  mobileLarge ? 170
                : smallWindow ? 180
                    : 160

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
                        style={{fontWeight:700, color:'#eee'}}
                    >
                        {brandNameBeltList.map((brand, index) =>
                            brand === 'Top Brands' && <MenuItem disabled key={index} value={brand}>{brand}</MenuItem>
                            || brand === 'All Brands' && <MenuItem disabled key={index} value={brand}>{brand}</MenuItem>
                            || brand === 'divider' && <Divider key={index}/>
                            || <MenuItem key={index} value={brand}>{brand}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </div>
            <div style={{textAlign: 'center'}}>
                <div style={combinedDivStyle}>
                    <div style={{width:barDivWidth, verticalAlign:'top', height:barDivHeight}}>
                        <BrandBeltBar beltData={beltData} brandName={brandName}/>
                    </div>
                    <div style={{width:pieDivWidth, height:pieDivHeight}}>
                        <BrandMechanismPie beltData={mechanismData} brandName={brandName}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default BrandDistribution
