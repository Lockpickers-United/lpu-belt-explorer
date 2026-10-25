import {useContext, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import FilterContext from '../context/FilterContext.jsx'

export default function useDefaultAdvancedFilterGroup({
    fieldName,
    value,
    matchType = 'Is',
    operator = 'OR'
}) {
    const {activeFilterGroups, setAdvancedFilterGroups} = useContext(FilterContext)
    const location = useLocation()
    const initializedLocationKeyRef = useRef()

    useEffect(() => {
        if (initializedLocationKeyRef.current === location.key) return
        initializedLocationKeyRef.current = location.key
        if (activeFilterGroups().length > 0) return

        setAdvancedFilterGroups([{
            fieldName,
            matchType,
            operator,
            values: [value]
        }])
    }, [activeFilterGroups, fieldName, location.key, matchType, operator, setAdvancedFilterGroups, value])
}
