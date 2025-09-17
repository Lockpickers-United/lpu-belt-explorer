import RaffleEntries from '../RaffleEntries.jsx'
import React, {useContext, useMemo} from 'react'
import AuthContext from '../../app/AuthContext.jsx'
import DataContext from '../../context/DataContext.jsx'


export default function RaffleDrawingEntries() {

    const {lockCollection} = useContext(AuthContext)
    const {potEntries} = useContext(DataContext)

    const drawPots = useMemo(() => {
        return potEntries.filter(pot => pot.entrants?.length > 0)
    },[potEntries])

    console.log('RaffleDrawingEntries potEntries', potEntries)
    console.log('RaffleDrawingEntries drawPots', drawPots)

    return (
        <RaffleEntries profile={lockCollection} allPots={drawPots} drawing={true}/>
    )
}