import React from 'react'
import SearchBox from '../nav/SearchBox.jsx'
import ViewFilterButtons from './ViewFilterButtons.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

export default function SearchFilterBar({label, sortValues, resetAll}) {

    const {isMobile} = useWindowSize()
    const flexStyle = !isMobile ? 'flex' : 'block'
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}

    return (
        <div style={{display: flexStyle, ...style, backgroundColor: '#333', minHeight:72}}>
            <div style={{display: 'flex', flexGrow: 1, marginLeft: 8}}>
                <SearchBox label={label} keepOpen={true}/>
            </div>
            {!!sortValues &&
                <div style={{margin: '12px 20px 0px 20px'}}>
                    <ViewFilterButtons sortValues={sortValues} resetAll={resetAll} advancedEnabled={true}/>
                </div>
            }
        </div>
    )
}