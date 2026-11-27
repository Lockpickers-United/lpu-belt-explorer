import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import dayjs from 'dayjs'
import raflBonusData from '../data/raflBonuses.json'
import {Collapse} from '@mui/material'
import useForm from '../formUtils/useForm.jsx'
import FormElement from '../formUtils/FormElement.jsx'
import {pickRandomWinners} from './admin/pickRandomWinners.js'
import DBContext from '../app/DBContext.jsx'
import Button from '@mui/material/Button'
import DisplayTable from '../misc/DisplayTable.jsx'
import ExportButtonGeneric from '../misc/ExportButtonGeneric.jsx'

export default function RaffleBonusDrawingBar() {
    const {allRaffleEntries} = useContext(DBContext)
    const [winners, setWinners] = useState(undefined)
    const startDate = dayjs(import.meta.env.VITE_RAFL_START_DATE).format('MM/DD/YYYY')
    const endDate = dayjs(import.meta.env.VITE_RAFL_END_DATE).format('MM/DD/YYYY')

    const bonusMap = useMemo(() => {
        return {'Ad Hoc': {
                'id': 'ad-hoc',
                'title': 'Ad Hoc',
                'description': 'Ad Hoc bonus drawing',
                'winnerCount': 1,
                'startDate': startDate,
                'endDate': endDate
            }}
    }, [])

    const bonusOptions = raflBonusData
        .sort((a, b) => dayjs(b.endDate).diff(dayjs(a.endDate)))
        .map(bonus => {
            const endString = dayjs(bonus.endDate).format('MMM D')
            const option = bonus.title + ' (' + endString + ')'
            bonusMap[option] = bonus
            return option
        })
    bonusOptions.push('Ad Hoc')
    console.log('raflBonusData', raflBonusData)

    let form
    const [bonus, setBonus] = useState({})

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        let events = [event]
        if (name === 'bonus') {
            setWinners(undefined)
            setBonus(bonusMap[value])
            events.push({target: {name: 'winnerCount', value: bonusMap[value]?.winnerCount}})
            events.push({target: {name: 'startDate', value: bonusMap[value]?.startDate}})
            events.push({target: {name: 'endDate', value: bonusMap[value]?.endDate}})
        }
        return events
    }, [bonusMap])

    const baseForm = useMemo(() => {
        return {}
    }, [])
    form = useForm({baseForm, processChange})
    console.log('form', form?.form)

    const eligibleEntries = useMemo(() => {
        if (!allRaffleEntries || !bonus.title) return []
        return allRaffleEntries
            .filter(entry =>
                dayjs(entry.createdAt).isAfter(dayjs(form?.form?.startDate))
                && entry.status === 'approved'
            )
            .map(entry => {
                const {id, username, platform} = entry
                return {id, username, platform}
            })
    }, [allRaffleEntries, bonus.title, form?.form])

    const drawWinners = useCallback(() => {
        setWinners(pickRandomWinners(eligibleEntries, form.form?.winnerCount)
            .sort((a, b) => a.username.localeCompare(b.username)))
    }, [eligibleEntries, form.form?.winnerCount])

    const tableData = useMemo(() => {
        if (!winners) return {}
        const columns = [
            {name: 'Username', id: 'username'},
            {name: 'Platform', id: 'platform'},
            {name: 'id', id: 'id'}
        ]
        return {columns, rows: winners}
    }, [winners])

    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: [],
                clearOnSubmit: false
            })
        }
    }, [form])

    const flagColor = eligibleEntries.length >= bonus.winnerCount ? '#0b0' : '#f00'

    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(() => {
        form.reload()
        setOpen(prev => !prev)
    }, [form])

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8, fontSize: '0.9rem'}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12, fontSize: '1.0rem'}

    return (
        <>
            <div style={{...style, padding: 0, marginBottom: 4, width: '100%'}}>
                <div style={{width: '100%', textAlign: 'right'}}>
                    <Link onClick={handleOpen} style={{fontSize: '0.85rem'}}>{open ? 'Close' : 'Draw'} Bonus
                        Winners</Link>
                </div>
                <Collapse in={open} style={{backgroundColor: '#333'}}>
                    <div style={{display: 'flex', flexDirection: 'row', padding: 8, gap: 10, flexWrap: 'wrap'}}>
                        <FormElement fieldType={'SelectBox'}
                                     fieldName={'bonus'}
                                     description={'Choose Bonus'}
                                     options={bonusOptions}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '0.9rem', fontWeight: 500},
                                         inputSize: 'small',
                                         inputWidth: 250,
                                         fontSize: '0.9rem'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>
                        {form.form.bonus &&
                            <>
                                <FormElement fieldType={'TextField'}
                                             fieldName={'winnerCount'}
                                             description={`Winners (${bonus.winnerCount})`}
                                             fieldSettings={{
                                                 descriptionStyle: {fontSize: '0.9rem', fontWeight: 500},
                                                 inputSize: 'small',
                                                 inputWidth: 90,
                                                 fontSize: '0.9rem'
                                             }}
                                             form={form}
                                             formDefaults={formDefaults}/>

                                <FormElement fieldType={'DatePicker'}
                                             fieldName={'startDate'}
                                             description={'Start Date'}
                                             value={dayjs()}
                                             fieldSettings={{
                                                 descriptionStyle: {fontSize: '0.9rem', fontWeight: 500},
                                                 inputSize: 'small',
                                                 inputWidth: 145,
                                                 fontSize: '0.9rem'
                                             }}
                                             form={form}
                                             formDefaults={formDefaults}
                                             disableFuture
                                />
                                <FormElement fieldType={'DatePicker'}
                                             fieldName={'endDate'}
                                             description={'End Date'}
                                             value={dayjs()}
                                             fieldSettings={{
                                                 descriptionStyle: {fontSize: '0.9rem', fontWeight: 500},
                                                 inputSize: 'small',
                                                 inputWidth: 145,
                                                 fontSize: '0.9rem'
                                             }}
                                             form={form}
                                             formDefaults={formDefaults}
                                             disableFuture
                                />
                            </>
                        }


                    </div>
                    {form.form.bonus &&
                        <div style={{
                            display: 'flex', flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', padding: 8, gap: 10
                        }}>
                            <div style={{fontSize: '1.0rem'}}>Eligible entries: <span
                                style={{fontWeight: 500, color: flagColor}}>{eligibleEntries.length}</span></div>
                            <Button
                                onClick={drawWinners}
                                variant='contained'
                                color='info'
                                size='small'
                                disabled={eligibleEntries.length === 0}>
                                Draw
                            </Button>
                        </div>
                    }

                    {tableData.rows &&
                        <div
                            style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
                            <DisplayTable tableData={tableData} showHeader={true} alternateRows={true}
                                          colorData={'#ddd'} fontSize={'0.9rem'} fontWeightData={400}
                                          paddingData={4} backgroundColor={'#222'}/>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: 16}}>
                                <ExportButtonGeneric
                                    exportData={{
                                        data: winners,
                                        csvHeaders: [{username: 'Username'}, {platform: 'Platform'}, {id: 'id'}],
                                        textButton: true
                                    }}
                                />
                            </div>
                        </div>
                    }
                </Collapse>
            </div>

        </>
    )

}

const formDefaults = {
    margin: '0px 0px 4px 0px',
    labelStyle: {fontSize: '0.9rem', fontWeight: 700},
    descriptionStyle: {fontSize: '0.9rem', fontWeight: 400},
    sectionHeaderStyle: {},
    sectionHeaderInfoStyle: {},
    inputWidth: 80,
    inputSize: 'small',
    color: 'info'
}
