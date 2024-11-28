import RafflePotForm from './RafflePotForm.jsx'
import React, {useCallback, useState} from 'react'

export default function RafflePotConfigurator({
                                                  donation,
                                                  questionStyle,
                                                  potData,
                                                  showIssues,
                                                  setPotError,
                                                  setPotData
                                              }) {

    const [pots, setPots] = useState([0, 1]) // eslint-disable-line
    const [allocated, setAllocated] = useState(0)
    const difference = donation ? donation - allocated : 0 - allocated

    const handleAllocated = useCallback(() => {
        console.log('handleAllocated potData[0].tickets', potData[0]?.tickets)
        const newAllocated = Object.keys(potData).reduce((acc, pot) => {
            acc = acc ? acc + potData[pot].tickets : potData[pot].tickets
            return acc
        }, 0)
        setAllocated(newAllocated ? newAllocated : 0)
    },[potData])

    console.log('potData[0].tickets', potData[0]?.tickets)

    const handlePotChange = useCallback((index, potDetails, complete) => {
        const newPotData = {...potData}
        newPotData[index] = potDetails
        setPotData(newPotData)
        setPotError(!complete)
        console.log('handlePotChange potData[0].tickets', potData[0]?.tickets)
        handleAllocated()
    }, [handleAllocated, potData, setPotData, setPotError])

    const differenceStyle = difference > 0
        ? {color: '#0b0', fontWeight: 700}
        : difference < 0
            ? {color: '#b00', fontWeight: 700}
            : {fontWeight: 700}
    return (
        <React.Fragment>

            {donation > 0 && <span></span>}
            <div style={{display: 'flex', justifyContent:'center'}}>
                <div style={{margin: 8}}>Total tickets: <strong>{donation ? donation : 0}</strong></div>
                <div style={{margin: 8}}>Allocated: <strong>{allocated}</strong></div>
                <div style={{margin: 8, ...differenceStyle}}>
                    Remaining: <span style={differenceStyle}>{donation || allocated ? difference : 0}</span>
                </div>
            </div>

            {
                pots.map(pot =>
                    <RafflePotForm questionStyle={questionStyle} key={pot} index={pot}
                                   potData={potData} handlePotChange={handlePotChange}
                                   showIssues={showIssues} setPotError={setPotError}/>
                )
            }
        </React.Fragment>
    )
}