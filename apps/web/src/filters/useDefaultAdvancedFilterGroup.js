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
    const initializedPathnameRef = useRef()

    useEffect(() => {
        if (initializedPathnameRef.current === location.pathname) return
        initializedPathnameRef.current = location.pathname
        if (activeFilterGroups().length > 0) return

        setAdvancedFilterGroups([{
            fieldName,
            matchType,
            operator,
            values: [value]
        }])
    }, [activeFilterGroups, fieldName, location.pathname, matchType, operator, setAdvancedFilterGroups, value])
}
