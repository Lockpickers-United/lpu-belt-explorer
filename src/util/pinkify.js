import {uniqueBelts} from '../data/belts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(utc)
dayjs.extend(isBetween)

const start = dayjs.utc('2025-03-28T00:01:00Z')
const end = dayjs.utc('2025-04-02T07:01:00Z')
const pink = dayjs().isBetween(start, end)

//console.log(`Pinkify is ${pink ? 'on' : 'off'}`, dayjs.utc().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))

export default function (input) {
    const pinks = ['Baby Pink', 'Pastel Pink', 'Blush Pink', 'Rose Pink', 'Coral Pink', 'Hot Pink', 'Bubblegum Pink', 'Magenta', 'Fuchsia']
    return pink
        ? replaceWholeWords(input, uniqueBelts, pinks)
        : input
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceWholeWords(input, find, replaceWith) {
    if (!Array.isArray(find) || !Array.isArray(replaceWith) || find.length !== replaceWith.length) {
        throw new Error("Both 'find' and 'replaceWith' must be arrays of the same length")
    }
    let output = input
    for (let i = 0; i < find.length; i++) {
        const escaped = escapeRegex(find[i])
        const pattern = new RegExp(`\\b${escaped}\\b`, 'ig')
        output = output.replace(pattern, replaceWith[i])
    }
    return output
}
