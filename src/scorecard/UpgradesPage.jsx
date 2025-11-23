import React, {useContext, useCallback, useState} from 'react'
import DataContext from '../locks/LockDataProvider'
import entryName from '../entries/entryName'
import {allUpgradesPartitioned} from '../entries/entryutils'
import IntroCopy from '../misc/IntroCopy.jsx'
import UpgradeEntry from './UpgradeEntry.jsx'
import FilterContext from '../context/FilterContext.jsx'

function UpgradesPage() {
    const {allEntries = []} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const allUpgradeEntries = allUpgradesPartitioned.map(entryIdArray => {
        return entryIdArray.map(entryId => {
            return getEntryFromId(entryId)
        }).filter(x => x)
    }).filter(x => x.length > 0)
        .sort((a, b) => {
            return entryName(a[0]).localeCompare(entryName(b[0]))
        })

    return (
        <React.Fragment>
            <div style={{margin: 8, padding: '20px 0px'}}>

                <IntroCopy pageName={'upgrades'}/>

                {allUpgradeEntries.map((upgradeTree, index) =>
                    <UpgradeEntry
                        key={index}
                        upgradeTree={upgradeTree}
                        baseId={upgradeTree[0].id}
                        expanded={upgradeTree[0].id === entryExpanded}
                        onExpand={setEntryExpanded}
                    />
                )}
            </div>
        </React.Fragment>
    )
}

export default UpgradesPage
