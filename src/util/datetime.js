import dayjs from 'dayjs'
import localeMap from 'dayjs/locale.json'
import {localeLoader} from './localeLoader'
import customParseFormat from'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(utc)

const allLocales = localeMap.map(l => l.key)

function loadLocale(locale) {
    if (allLocales.includes(locale)) {
        try {
            localeLoader(locale).then(() => {
                dayjs.locale(locale)
                // console.info(`Set locale to ${dayjs.locale()}`)
            })
            return true
        } catch (err) {
            throw new Error(`Unable to import dayjs/locale/${locale} error ${err}`)
        }
    }
    // console.info(`Unsupported locale ${locale}`)
    return false
}

export default function initializeLocales() {
    let navLangs = (navigator.languages || (navigator.language ? [navigator.language] : [])).map(l => l.toLowerCase())
    let localeLoaded = false

    for (let idx=0; !localeLoaded && idx < navLangs.length; idx++) {
        const lang = navLangs[idx]
        localeLoaded = loadLocale(lang)

        if (!localeLoaded && lang.includes('-')) {
            localeLoaded = loadLocale(lang.split('-')[0])
        }
    }
}
