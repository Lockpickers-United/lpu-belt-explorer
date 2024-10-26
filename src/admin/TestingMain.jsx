import React, {useCallback, useState} from 'react'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import dayjs from 'dayjs'
import {siteFullNew} from '../data/dataUrls'
import AdminStatsTable from './AdminStatsTable.jsx'


import dailydataDH from '../../public/test/dailydata-dh.json'
import dailydataGD from '../../public/test/dailydata-gd.json'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'

function TestingMain() {
    usePageTitle('Testing')
    const {data, loading, error} = useData({urls})
    const {siteFullNew} = data || {}
    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const summaryHeaderStyle = siteFullNew?.firstVistsLastSevenDays?.countryCount
        ? headerStyle
        : firstHeaderStyle

    const stats = ['visitors', 'visits', 'beacons', 'logEntries']
    const columns = [
        {'name': 'Metric', 'align': 'left', 'id': 'metric'},
        {'name': 'GD ' + dailydataDH.date, 'align': 'left', 'id': 'col1'},
        {'name': 'DH ' + dailydataDH.date, 'align': 'left', 'id': 'col2'},
        {'name': 'difference', 'align': 'left', 'id': 'difference'}
    ]
    let rows = stats.reduce((acc, stat) => {
        acc.push({'metric': stat, col1: dailydataGD[stat], col2: dailydataDH[stat], difference: dailydataDH[stat]-dailydataGD[stat]})
        return acc
    }, [])

    let stat = 'lockViewsById'
    const allLocks1 = [...Object.keys(dailydataDH[stat])]
    const lockViews1 = allLocks1.reduce((acc, lockId) => {
        acc = acc ? acc + dailydataDH[stat][lockId] + 0 : dailydataDH[stat][lockId] +0
        return acc
    }, 0)
    const allLocks2 = [...Object.keys(dailydataGD[stat])]
    const lockViews2 = allLocks2.reduce((acc, lockId) => {
        acc = acc ? acc + dailydataGD[stat][lockId] + 0 : dailydataGD[stat][lockId] +0
        return acc
    }, 0)

    rows.push({'metric': 'lock views', col1: lockViews2, col2: lockViews1, difference: lockViews1-lockViews2})

    const tableData = {columns: columns, data: rows}


    // SELECT
    const metrics =['requestsByServerHour', 'pageViews', 'lockViewsByIP', 'lockViewsById', 'browsers', 'platforms', 'states', 'countries']
    const [metric, setMetric] = useState('requestsByServerHour')

    const rows2 = [{'metric': '', col1: '', col2: ''}]

    stat = metric
    rows2.push({'metric': stat, col1: stat, col2: stat})

    const allKeys = [...Object.keys(dailydataDH[stat]), ...Object.keys(dailydataGD[stat])]
        .sort((a, b) => {
            return dailydataGD[stat][b] - dailydataGD[stat][a]
        })
    rows2.push(...[...new Set(allKeys)].reduce((acc, key) => {
        acc.push({'metric': key, col1: dailydataGD[stat][key], col2: dailydataDH[stat][key], difference: (dailydataDH[stat][key] || 0)-(dailydataGD[stat][key] || 0)})
        return acc
    }, []))

    const tableData2 = {columns: columns, data: rows2}




    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        setMetric(event.target.value)
        handleClose()
    },[handleClose])

    if (loading) return <LoadingDisplay/>
    else if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>
            <div style={summaryHeaderStyle}>
                Site Summary<br/>
            </div>

            <AdminStatsTable tableData={tableData} tableWidth={700} fontSize={'1rem'}/>


            <div style={{marginTop: 24, textAlign: 'center'}}>
                <FormControl id='brandPulldown' style={{marginBottom: 20, minWidth: 200, textAlign: 'left'}}>
                    <InputLabel>Brand</InputLabel>
                    <Select
                        id='metricSelect'
                        value={metric}
                        label='Brand'
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        onChange={handleChange}
                        style={{fontWeight: 700, color: '#eee'}}
                    >
                        {metrics.map((metric, index) =>
                            <MenuItem key={index} value={metric}>{metric}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </div>

            <AdminStatsTable tableData={tableData2} tableWidth={700} fontSize={'1rem'}/>

        </div>
    )
}

const urls = {
    siteFullNew
}

export default TestingMain
