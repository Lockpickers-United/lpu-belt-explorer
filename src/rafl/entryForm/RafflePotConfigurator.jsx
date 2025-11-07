import RafflePotForm from './RafflePotForm.jsx'
import React, {useCallback, memo} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../../util/useWindowSize.jsx'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Link from '@mui/material/Link'

function RafflePotConfigurator({
                                   donation,
                                   questionStyle,
                                   potData,
                                   showIssues,
                                   setPotData,
                                   allocated
                               }) {

    const difference = donation ? parseInt(donation) - allocated : 0 - allocated

    const addPot = useCallback(() => {
        setPotData(prev => ([...(prev || []), {tickets: 0}]))
    }, [setPotData])

    const removePot = useCallback((index) => {
        setPotData(prev => {
            const list = [...(prev || [])]
            list.splice(index, 1)
            return list.length ? list : [{tickets: 0}]
        })
    }, [setPotData])

    const handleAuto = useCallback(() => {
        setPotData(prev => {
            const count = (prev || []).length || 1
            const base = Math.floor((donation || 0) / count)
            const remainder = (donation || 0) % count
            const next = [...(prev || [])]
            next.forEach((pot, index) => {
                if (donation) {
                    next[index] = {...pot, tickets: base + (index === 0 ? remainder : 0)}
                } else {
                    next[index] = {...pot, tickets: 0}
                }
            })
            return next
        })
    }, [donation, setPotData])

    const handlePotChange = useCallback((index, potDetails) => {
        setPotData(prev => {
            const next = [...(prev || [])]
            next[index] = potDetails
            return next
        })
    }, [setPotData])

    const differenceStyle = difference > 0
        ? {color: '#da8312', fontWeight: 700}
        : difference < 0
            ? {color: '#b00', fontWeight: 700}
            : {}

    const {isMobile, flexStyle} = useWindowSize()
    const tallySize = !isMobile ? '1.2rem' : '1.0rem'

    const divider = (potData || []).length > 1
        ? <div style={{height: 0, margin: '20px 0px', borderBottom: '2px solid #bbb', alignItems: 'center'}}/>
        : null

    return (
        <React.Fragment>

            {
                (potData || []).map((_, pot) =>
                    <RafflePotForm questionStyle={questionStyle} key={pot} index={pot}
                                   potData={potData} handlePotChange={handlePotChange}
                                   showIssues={showIssues} removePot={removePot}/>
                )
            }

            {divider}

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button variant='outlined' onClick={() => {
                    addPot()
                }} size='small' color='info' startIcon={<AddCircleIcon/>}>
                    Add Pot
                </Button>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', fontSize: tallySize, marginTop: 15}}>
                <div style={{display: flexStyle, padding: 8}}>
                    <div>
                        <nobr>Total tickets</nobr>
                    </div>
                    <div>&nbsp;<strong>{donation ? donation : 0}</strong></div>
                </div>

                <div style={{display: flexStyle, padding: 8, margin: '0px 10px'}}>
                    <div>
                        <nobr>Allocated</nobr>
                    </div>
                    <div>&nbsp;<strong>{allocated}</strong></div>
                </div>

                <div style={{display: flexStyle, padding: 8}}>
                    <div style={{...differenceStyle}}>
                        <nobr>Remaining</nobr>
                    </div>
                    <div style={{...differenceStyle}}>&nbsp;
                        <strong>{donation || allocated ? difference : 0}</strong>
                    </div>
                </div>

                {donation && donation > 0 ?
                    <div style={{display: flexStyle, padding: 8, marginLeft: 10, alignContent: 'center'}}>
                        <Link onClick={() => {
                            handleAuto()
                        }} style={{color: '#417ee6', fontWeight: 700}}>Auto</Link>
                    </div>
                    : null
                }
            </div>

            {showIssues && donation !== allocated &&
                <div style={{
                    fontSize: '0.75rem',
                    color: '#f44336',
                    margin: '4px 14px 0px 14px',
                    textAlign: 'center'
                }}>
                    {showIssues && donation > allocated
                        ? <span>All tickets must be assigned to a pot</span>
                        : showIssues && donation < allocated
                            ? <span>You have too many tickets allocated</span>
                            : <span>&nbsp;</span>}
                </div>
            }
        </React.Fragment>
    )
}

export default memo(RafflePotConfigurator)