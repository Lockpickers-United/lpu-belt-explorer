import React, {useMemo} from 'react'

const ReportsContext = React.createContext({})

export function ReportsProvider({children}) {
    const foo = 'bar'
    const value = useMemo(() => ({
        foo
    }), [foo])

    return (
        <ReportsContext.Provider value={'bar'}>
            {children}
        </ReportsContext.Provider>
    )
}

export default ReportsContext