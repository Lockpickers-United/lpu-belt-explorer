import {useContext, useEffect, useState} from 'react'
import DataContext from './DataContext.jsx'
import AppContext from './AppContext.jsx'

function useSlowData() {
    const {visibleEntries} = useContext(DataContext)
    const {tab} = useContext(AppContext)
    const [value, setValue] = useState([])
    const [progress, setProgress] = useState(1)

    useEffect(() => {
        let cancelling = false

        const loadData = async () => {
            setValue([])

            const data = tab === 'search'
                ? visibleEntries
                : visibleEntries.filter(entry => entry.simpleBelt === tab)

            const total = data.length, pageSize = 10
            let page = 0, moreToDo = false

            do {
                const end = page * pageSize + pageSize
                if (!cancelling) {
                    setValue(data.slice(0, end))
                    setProgress(page * pageSize / total)
                }

                page++
                moreToDo = page * pageSize <= total
                await new Promise(resolve => setTimeout(() => resolve(), 0))
            } while (!cancelling && moreToDo)

            setProgress(1)
        }
        loadData()

        return () => {
            setProgress(1)
            cancelling = true
        }
    }, [tab, visibleEntries])

    return {value, progress}
}

export default useSlowData
