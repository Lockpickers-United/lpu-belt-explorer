import dayjs from 'dayjs'
import customParseFormat from'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export function user2SysDate(date) {
    const dayParse = dayjs(date, ['YYYY-M-D', 'YYYY-MM-DD', 'YYYY-MM-D', 'YYYY-M-DD'], true)
    if (dayParse.isValid()) {
        return dayParse.toISOString()
    } else {
        return null
    }
}

export function sys2UserDate(date) {
    return date ? dayjs(date).format('YYYY-M-D') : null
}

export function now2UserDate() {
    return dayjs().format('YYYY-M-D')
}
