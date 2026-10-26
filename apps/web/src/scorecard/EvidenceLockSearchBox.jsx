import LockEntrySearchBox from '../content/LockEntrySearchBox.jsx'
import React from 'react'
import allEntries from '../data/data.json'

export default function EvidenceLockSearchBox({ handleChangeLock }) {




    return (
        <div style={{maxWidth: 630, marginBottom: 20, marginTop:10}}>
            <div style={{fontWeight:600, marginBottom:5}}>Select Lock</div>
        <LockEntrySearchBox handleChangeLock={handleChangeLock} allEntries={allEntries}
                            reset={() => {}}/>
        </div>
    )
}