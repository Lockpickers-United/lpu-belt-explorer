import React, {useEffect, useMemo, useState} from 'react'

const LazyDataContext = React.createContext({})

export function LazyDataProvider({children}) {
    const [data, setData] = useState([])

    useEffect(() => {
        const load = async () => {
            const value = (await import('../data/data.json')).default
            setData(value)
        }
        load()
    }, [])

    const value = useMemo(() => ({
        data
    }), [data])

    if (!data?.length) return null
    return (
        <LazyDataContext.Provider value={value}>
            {children}
        </LazyDataContext.Provider>
    )
}

export default LazyDataContext
