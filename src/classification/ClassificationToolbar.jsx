import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import React, {useMemo} from 'react'
import useWindowSize from '../util/useWindowSize'
import {Link, useLocation} from 'react-router-dom'
import {useAccess} from '../app/AccessContext.jsx'

export default function ClassificationToolbar() {
    const {accessInfo} = useAccess()

    const changelogLabel = useMemo(() => {
        return accessInfo.roles.classificationAdmin
            ? 'Publish Changelog'
            : 'Changelogs'
    }, [accessInfo.roles.classificationAdmin])

    const tabs = useMemo(() => [
        {label: 'Active', mobileLabel: 'Active', value: '/classification'},
        {label: 'Ranked', mobileLabel: 'Ranked', value: '/classification/ranked'},
        {label: 'Historical', mobileLabel: 'Past', value: '/classification/past'},
        {label: changelogLabel, mobileLabel: 'Changelogs', value: '/classification/changelog'}
    ], [changelogLabel])

    const location = useLocation()

    const {isMobile} = useWindowSize()
    const padding = !isMobile ? '12px 16px' : '12px 0px'
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
                        label={!isMobile ? tab.label : tab.mobileLabel}
                        value={tab.value}
                        style={{padding}}
                        component={Link}
                        to={tab.value}/>
                )}
            </Tabs>
        </AppBar>
    )
}
