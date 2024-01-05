import React from 'react'
import LockViewsLine from './LockViewsLine.jsx'
import DataContext from '../locks/DataContext.jsx'
import {useWindowWidths} from './Functions.jsx'

function StatsPage() {

    const [midWidth,smallWidth,chartHeight] = useWindowWidths()

    return (
        <React.Fragment>
            <div style={{
                minWidth: '390px', maxWidth: 720, height: '100%',
                padding: '24px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto',
                fontSize: '1.5rem'
            }}>

                <DataContext.Provider value={{chartHeight}}>
                    <div>Weekly Lock Views</div>
                    <LockViewsLine/>
                </DataContext.Provider>

            </div>
        </React.Fragment>
    )
}
export default StatsPage
