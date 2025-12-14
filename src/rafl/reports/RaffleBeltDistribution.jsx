import React, {useState, useCallback, useMemo} from 'react'
import ChoiceButtonGroup from '../../util/ChoiceButtonGroup'
import RaffleBeltDistributionBar from './RaffleBeltDistributionBar'

/**
 * @property beltDonorCount
 * @property beltDonations
 */

function RaffleBeltDistribution({data}) {

    const beltDonations = useMemo(() => {
        return uniqueBelts.map((belt) => {
            return {
                value: data.beltDonations[belt] ? data.beltDonations[belt]/data.totalDonations : 0,
                id: belt,
                label: belt
            }
        })
    }, [data])

    const beltDonors = useMemo(() => {
        return uniqueBelts.map((belt) => {
            return {
                value: data.beltDonorCount[belt] ? data.beltDonorCount[belt]/data.totalEntries : 0,
                id: belt,
                label: belt
            }
        })
    }, [data])

    const options = useMemo(() => {
        return [
            {label: 'Donations', data: beltDonations},
            {label: 'Donors', data: beltDonors},
        ]
    }, [beltDonations, beltDonors])

    const [selected, setSelected] = useState(options[0])
    const handleChange = useCallback(newValue => setSelected(newValue), [])

    return (
        <div style={{textAlign: 'center'}}>
            <ChoiceButtonGroup options={options} onChange={handleChange}/>
            <RaffleBeltDistributionBar beltDistribution={selected.data}/>
        </div>
    )
}

const uniqueBelts = [
    'White',
    'Yellow',
    'Orange',
    'Green',
    'Blue',
    'Purple',
    'Brown',
    'Red',
    'Black'
]

export default RaffleBeltDistribution
