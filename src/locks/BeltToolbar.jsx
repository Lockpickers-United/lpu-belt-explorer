import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import LockListContext from './LockListContext'
import FilterContext from '../context/FilterContext'
import {uniqueBelts} from '../data/belts'
import BeltIcon from '../entries/BeltIcon'
import useWindowSize from '../util/useWindowSize'
import SortButton from '../filters/SortButton'
import {lockSortFields} from '../data/sortFields'
import FilterButton from '../filters/FilterButton.jsx'
import Button from '@mui/material/Button'

function BeltToolbar() {
    const {tab, setTab} = useContext(LockListContext)
    const {filters, addFilter, filterCount, clearAllFilters} = useContext(FilterContext)
    const {sort} = filters

    const reset = sort || filterCount > 0

    const tabWidth = Math.floor(window.innerWidth / 10)
    const {width} = useWindowSize()
    const smallWidth = width <= 500

    const tabWidthStyle = smallWidth
        ? {minWidth: tabWidth, maxWidth: tabWidth, opacity: 1}
        : {minWidth: 50, maxWidth: 50, opacity: 1}
    useHotkeys('1,2,3,4,5,6,7,8,9', ({key}) => {
        setTab(uniqueBelts[key - 1])
    })

    const flexStyle = !smallWidth ? 'flex' : 'block'
    const buttonPaddingTop = !smallWidth ? 3 : 3
    const buttonMarginBottom = !smallWidth ? 0 : 2

    const handleTabClick = useCallback((event, value) => setTab(value), [setTab])

    const handleReset = useCallback(() => {
        clearAllFilters()
    }, [clearAllFilters])

    const handleClick = useCallback(value => () => {
        if (tab === value) addFilter('tab', tab, true)
    }, [addFilter, tab])

    return (
        <AppBar position='relative' style={{boxShadow: 'none'}}>
            <div style={{display: flexStyle, justifyContent: 'center'}}>
                <div>
                    <Tabs
                        value={tab}
                        onChange={handleTabClick}
                        indicatorColor='secondary'
                        variant={smallWidth ? 'fullWidth' : 'standard'}
                        centered={!smallWidth}
                        textColor='inherit'
                    >
                        {uniqueBelts.map(belt =>
                            <CloneProps key={belt} value={belt}>
                                {tabProps => (
                                    <Tooltip title={`${belt} Belt`} arrow disableFocusListener>
                                        <Tab
                                            {...tabProps}
                                            icon={
                                                <BeltIcon value={belt} style={{paddingTop: 2}}/>
                                            }
                                            sx={tabWidthStyle}
                                            onClick={handleClick(belt)}
                                        />
                                    </Tooltip>
                                )}
                            </CloneProps>
                        )}
                        <CloneProps value='search'>
                            {tabProps => (
                                <Tooltip title='Search Results' arrow disableFocusListener>
                                    <Tab
                                        {...tabProps}
                                        icon={
                                            <ManageSearchIcon/>
                                        }
                                        sx={tabWidthStyle}
                                    />
                                </Tooltip>
                            )}
                        </CloneProps>
                    </Tabs>
                </div>
                <div style={{
                    display: 'flex',
                    paddingTop: buttonPaddingTop,
                    marginBottom: buttonMarginBottom,
                    marginLeft: 15,
                    justifyContent: 'center'
                }}>
                    <SortButton sortValues={lockSortFields} text={true}/>
                    <FilterButton extraFilters={[{key: 'tab', value: 'search'}]} text={true}/>
                    {reset &&
                        <Button style={{color: '#bbb', fontSize: '0.9rem', fontWeight: 700}} onClick={handleReset}>
                            RESET</Button>
                    }
                </div>
            </div>
        </AppBar>
    )
}

function CloneProps({children, ...other}) {
    return children(other)
}

export default BeltToolbar
