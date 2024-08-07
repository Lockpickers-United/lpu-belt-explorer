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

async function loadLocale(locale) {
    if (allLocales.includes(locale)) {
        try {
            await localeLoader(locale)
            dayjs.locale(locale)
            // console.info(`Set locale to ${dayjs.locale()}`)
            return true
        } catch (err) {
            throw new Error(`Unable to import dayjs/locale/${locale} error ${err}`)
        }
    }
    // console.info(`Unsupported locale ${locale}`)
    return false
}

export default async function initializeLocales() {
    let navLangs = (navigator.languages || (navigator.language ? [navigator.language] : [])).map(l => l.toLowerCase())
    // for testing
    // navLangs = ['de']

    let localeLoaded = false

    for (let idx=0; !localeLoaded && idx < navLangs.length; idx++) {
        const lang = navLangs[idx]
        localeLoaded = await loadLocale(lang)

        if (!localeLoaded && lang.includes('-')) {
            localeLoaded = await loadLocale(lang.split('-')[0])
        }
    }
}
