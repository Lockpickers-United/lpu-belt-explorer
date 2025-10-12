export default (filters, entries) => {
    if (!filters || Object.keys(filters).length === 0) return entries
    if (!entries || entries.length === 0) return []

    // Filters as an array (support negative values with leading '!')
    // Support OR within a single key using '||' delimiters, as well as AND using '@@' delimiters.
    const parseFilter = (key, rawVal) => {
        const str = String(rawVal ?? '')
        const negative = str.startsWith('!')
        const core = negative ? str.slice(1) : str
        const hasOr = core.includes('||')
        const hasAnd = !hasOr && core.includes('@@')
        const delimiter = hasOr ? '||' : hasAnd ? '@@' : null
        const values = delimiter ? core.split(delimiter).filter(Boolean) : [core].filter(Boolean)
        const operator = hasOr ? 'OR' : 'AND'
        return {key, values, negative, operator}
    }
    const filterArray = Object.keys(filters)
        .map(key => {
            const value = filters[key]
            return Array.isArray(value)
                ? value.map(subkey => parseFilter(key, subkey))
                : parseFilter(key, value)
        })
        .flat()

    // Filter the data
    return entries
        .filter(datum => {
            return filterArray.every(({key, values, negative, operator}) => {
                const datumVal = datum[key]
                const matcher = (val) => Array.isArray(datumVal) ? datumVal.includes(val) : datumVal === val
                const anyMatch = values.some(v => matcher(v))
                const allMatch = values.every(v => matcher(v))
                const match = (operator === 'OR') ? anyMatch : allMatch
                return negative ? !match : match
            })
        })

}

