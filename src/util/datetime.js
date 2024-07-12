export function user2SysDate(date) {
    if (date && date.match(/^\d\d\d\d-\d{1,2}-\d{1,2}$/)) {
        const fullDate = date.split('-').map(d => d.length === 1 ? '0' + d : d).join('-')
        const utcStr = fullDate + 'T00:00:00.000Z'
        return new Date(utcStr).toJSON()        
    } else {
        return null
    }
}

export function sys2UserDate(date) {
    const dateObj = date && new Date(date) 
    const dateStr = dateObj && dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth()+1) + '-' + dateObj.getUTCDate()
    return dateStr
}

export function now2UserDate() {
    return sys2UserDate(new Date().toJSON())
}
