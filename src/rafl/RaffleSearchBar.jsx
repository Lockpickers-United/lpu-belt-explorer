import React from 'react'
import SearchBox from '../nav/SearchBox.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

export default function RaffleSearchBar({label, sortValues, entryCount = 0}) {

    label = entryCount > 0 ? `${label} (${entryCount})` : label
    const {isMobile} = useWindowSize()
    const flexStyle = !isMobile ? 'flex' : 'block'
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}

    const borderstyle = label === 'Approved Charities' ? {borderBottom: '1px #555 solid'} : {}

    return (
        <div style={{display: flexStyle, ...style, backgroundColor: '#333', minHeight:72, ...borderstyle}}>
            <div style={{display: 'flex', flexGrow: 1, marginLeft: 8}}>
                <SearchBox label={label} keepOpen={true}/>
            </div>
            {!!sortValues &&
                <div style={{margin: '12px 20px 0px 20px'}}>
                    <ViewFilterButtons sortValues={sortValues} advancedEnabled={true}
                                       extraFilters={[{key: 'tab', value: 'search'}]}
                                       compactMode={false} resetAll={true} expandAll={true}/>

                </div>
            }
        </div>

    )

}