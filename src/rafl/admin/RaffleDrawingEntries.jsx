import RaffleEntries from '../RaffleEntries.jsx'
import React, {useContext, useMemo} from 'react'
import AuthContext from '../../app/AuthContext.jsx'
import DataContext from '../../context/DataContext.jsx'


export default function RaffleDrawingEntries() {

    const {lockCollection} = useContext(AuthContext)
    const {visiblePotEntries} = useContext(DataContext)

    console.log('RaffleDrawingEntries visiblePotEntries', visiblePotEntries)

    const drawPots = useMemo(() => {
        return visiblePotEntries?.filter(pot => pot.entrants?.length > 0)
    },[visiblePotEntries])

    console.log('RaffleDrawingEntries drawPots', drawPots)


    return (
        <RaffleEntries profile={lockCollection} allPots={drawPots} drawing={true}/>
    )
}