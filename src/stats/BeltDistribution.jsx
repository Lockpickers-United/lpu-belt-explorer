import React, {useState, useCallback, useMemo} from 'react'
import ChoiceButtonGroup from '../util/ChoiceButtonGroup'
import BeltDistributionBar from './BeltDistributionBar'
import {uniqueBelts} from '../data/belts'


function BeltDistribution({data}) {
    const options = useMemo(() => {
        const {
            lockSummary: {locksByBelt},
            siteFullNew: {lockViewsByBelt},
            collectionsSummary: {savesByBelt},
            collectionsStatsCurrent,
        } = data

        console.log('savesByBelt', savesByBelt)
        console.log('collectionsStatsCurrent', collectionsStatsCurrent.allUsers.savesByBelt)

        const savesByBeltNew = [...uniqueBelts, 'Unranked'].map(belt => {
            return {
                label: belt,
                id: belt,
                ...collectionsStatsCurrent.allUsers.savesByBelt[belt]
            }
        })

        console.log('savesByBeltNew', savesByBeltNew)

        return [
            {label: 'Site Views', data: lockViewsByBelt.data},
            {label: 'Locks', data: locksByBelt},
            {label: 'Collection Saves', data: savesByBelt},
            {label: 'Collection Saves NEW', data: savesByBeltNew},
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
