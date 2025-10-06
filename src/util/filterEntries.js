export default (filters, entries) => {
    if (!filters || Object.keys(filters).length === 0) return entries
    if (!entries || entries.length === 0) return []

    // Filters as an array (support negative values with leading '!')
    // Also support OR within a single key using '||' delimiters.
    const parseFilter = (key, rawVal) => {
        const str = String(rawVal ?? '')
        const negative = str.startsWith('!')
        const core = negative ? str.slice(1) : str
        const values = core.split('||').filter(Boolean)
        return {key, values, negative}
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
            return filterArray.every(({key, values, negative}) => {
                const datumVal = datum[key]
                const matcher = (val) => Array.isArray(datumVal) ? datumVal.includes(val) : datumVal === val
                const anyMatch = values.some(v => matcher(v))
                return negative ? !anyMatch : anyMatch
            })
        })

}

