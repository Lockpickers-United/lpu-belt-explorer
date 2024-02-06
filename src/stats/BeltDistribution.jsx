import React, {useState, useCallback, useMemo} from 'react'
import ChoiceButtonGroup from '../util/ChoiceButtonGroup'
import BeltDistributionBar from './BeltDistributionBar'

function BeltDistribution({data}) {
    const options = useMemo(() => {
        const {
            lockSummary: {locksByBelt},
            siteSummary: {lockViewsByBelt},
            collectionsSummary: {savesByBelt}
        } = data
        return [
            {label: 'Site Views', data: lockViewsByBelt.data},
            {label: 'Locks', data: locksByBelt},
            {label: 'Collection Saves', data: savesByBelt}
        ]
    }, [data])

    const [selected, setSelected] = useState(options[0])
    const handleChange = useCallback(newValue => setSelected(newValue), [])

    return (
        <div style={{textAlign: 'center'}}>
            <ChoiceButtonGroup options={options} onChange={handleChange}/>

            <BeltDistributionBar beltDistribution={selected.data}/>
        </div>
    )
}

export default BeltDistribution
