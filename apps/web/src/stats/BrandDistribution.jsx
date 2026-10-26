import React, {useCallback, useState} from 'react'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import useWindowSize from '../util/useWindowSize'
import BrandBeltBar from './BrandBeltBar'
import BrandMechanismPie from './BrandMechanismPie'

export default function BrandDistribution({data}) {

    const {brandData} = data

    const selectValues = [{name: 'Top Brands', key: 'Top Brands'}]
    topBrands.forEach((brand) => {
        if (brandData[brand]) selectValues.push({name: brand, key: brand + '__top'})
    })
    selectValues.push({name: 'divider', key: 'divider'})
    selectValues.push({name: 'All Brands', key: 'All Brands'})
    Object.keys(brandData).forEach((brand) => {
        selectValues.push({name: brand, key: brand})
    })

    const [brandKey, setBrandKey] = useState(topBrands[0]+'__top')
    const [brandName, setBrandName] = useState(topBrands[0])

    const beltData = brandData[brandName]?.belts
    const mechanismData = brandData[brandName]?.mechanisms

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleChange = useCallback(event => {
        setBrandKey(event.target.value)
        const brand = event.target.value.trim().replace('__top', '')
        setBrandName(brand)
        handleClose()
        setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
            }
        }, 0)
    }, [handleClose])

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
            : 180

    const pieDivHeight = mobileSmall ? 120
        : mobileMedium ? 120
            : mobileLarge ? 170
                : smallWindow ? 180
                    : 160

    return (
        <React.Fragment>
            <div style={{marginTop: 24, textAlign: 'center'}}>
                <FormControl id='brandPulldown' size='small'
                             style={{marginBottom: buttonMargin, minWidth: 200, textAlign: 'left'}}>
                    <InputLabel>Brand</InputLabel>
                    <Select
                        id='brandSelect'
                        variant='outlined'
                        value={brandKey}
                        label='Brand'
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        onChange={(e) => {
                            handleChange(e)
                        }}
                        style={{fontWeight: 700, color: '#eee'}}
                    >
                        {selectValues.map(({name, key}) =>
                            name === 'Top Brands' && <MenuItem disabled key={key} value={key}>{name}</MenuItem>
                            || name === 'All Brands' && <MenuItem disabled key={key} value={key}>{name}</MenuItem>
                            || name === 'divider' && <Divider key={key}/>
                            || <MenuItem key={key} value={key}>{name}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </div>
            <div style={{textAlign: 'center'}}>
                <div style={combinedDivStyle}>
                    <div style={{width: barDivWidth, verticalAlign: 'top', height: barDivHeight}}>
                        <BrandBeltBar beltData={beltData} brandName={brandName}/>
                    </div>
                    <div style={{width: pieDivWidth, height: pieDivHeight}}>
                        <BrandMechanismPie beltData={mechanismData} brandName={brandName}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const topBrands = [
    'ABUS',
    'ALPHA',
    'ASSA',
    'Australian Lock Co.',
    'BASI',
    'BKS',
    'Burg Wächter',
    'CES',
    'Chubb',
    'DOM',
    'EVVA',
    'Fichet',
    'GOAL',
    'IKON',
    'Kaba',
    'Keso',
    'Lockwood',
    'M&C',
    'Master Lock',
    'Mauer',
    'Medeco',
    'MIWA',
    'Mottura',
    'Mul-T-Lock',
    'Ruko',
    'Vachette',
    'Wilka',
    'Winkhaus',
    'Yale'
]
