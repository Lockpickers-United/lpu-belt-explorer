import React, {useMemo} from 'react'
import UIContext from '../context/UIContext.jsx'

export function ClassificationUIProvider({children}) {

    const value = useMemo(() => ({}), [])

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext
