import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import React, {useMemo} from 'react'
import useWindowSize from '../util/useWindowSize'
import {Link, useLocation} from 'react-router-dom'

export default function ClassificationToolbar() {

    const tabs = useMemo(() => [
        {label: 'Current Changes', mobileLabel: 'Current', value: '/classification'},
        {label: 'Previous Votes', mobileLabel: 'Previous', value: '/classification/previous'},
        {label: 'Publish Changelog', mobileLabel: 'Changelogs', value: '/classification/changelog'}
    ], [])

    const location = useLocation()

    const {isMobile} = useWindowSize()

    return (
        <AppBar position='relative' style={{boxShadow: 'none'}}>
            <Tabs
                value={location.pathname}
                indicatorColor='secondary'
                centered
                textColor='inherit'
            >
                {tabs.map((tab) =>
                    <Tab
                        key={tab.value}
                        label={
                            <Tooltip title={tab.label} arrow disableFocusListener>
                                <span>{!isMobile ? tab.label : tab.mobileLabel}</span>
                            </Tooltip>
                        }
                        value={tab.value}
                        component={Link}
                        to={tab.value}/>
                )}
            </Tabs>
        </AppBar>
    )
}
