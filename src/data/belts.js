//#FFC0CB, #FF69B4, #FF00FF, #F9AFAE, #FF66CC, #F88379, #FFD1DC, #FFB6C1, #FFCCCB, #FF00AA

/*
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js' //eslint-disable-line
import isBetween from 'dayjs/plugin/isBetween.js' //eslint-disable-line
dayjs.extend(utc)
dayjs.extend(isBetween)
const start = dayjs.utc('2025-03-28T00:01:00Z')
const end = dayjs.utc('2025-04-02T07:01:00Z')
*/
const pinkify = false

const belts = pinkify
    ? {
        White: {color: '#ffdbe4', danPoints: 0},
        Yellow: {color: '#fcc8d4', danPoints: 0},
        Orange: {color: '#FFB6C1', danPoints: 0},
        Green: {color: '#eaa5a4', danPoints: 0},
        Blue: {color: '#F88379', danPoints: 1},
        Purple: {color: '#FF69B4', danPoints: 3},
        Brown: {color: '#FF66CC', danPoints: 6},
        Red: {color: '#FF00AA', danPoints: 10},
        Black: {color: '#FF00FF', lineColor: '#000', danPoints: 18},
        'Black 1': {color: '#FF00FF', lineColor: '#000', danPoints: 18},
        'Black 2': {color: '#FF00FF', lineColor: '#000', danPoints: 24},
        'Black 3': {color: '#FF00FF', lineColor: '#000', danPoints: 30},
        'Black 4': {color: '#FF00FF', lineColor: '#000', danPoints: 36},
        'Black 5': {color: '#FF00FF', lineColor: '#000', danPoints: 50},
        'Project': {color: '#FF00FF', lineColor: '#c7c340', danPoints: 5},
        'Project 1': {color: '#000000', lineColor: '#c7c340', danPoints: 5},
        'Project 2': {color: '#000000', lineColor: '#c7c340', danPoints: 10},
        'Project 3': {color: '#000000', lineColor: '#c7c340', danPoints: 20},
        'Project 4': {color: '#000000', lineColor: '#c7c340', danPoints: 34},
        'Project 5': {color: '#000000', lineColor: '#c7c340', danPoints: 50},
        'Unranked': {color: '#000000', lineColor: '#d3d31c', danPoints: 0},
        'Tier 1': {color: '#000000', lineColor: '#80b535', danPoints: 5},
        'Tier 2': {color: '#000000', lineColor: '#80b535', danPoints: 10},
        'Tier 3': {color: '#000000', lineColor: '#80b535', danPoints: 20},
        'Tier 4': {color: '#000000', lineColor: '#80b535', danPoints: 34},
        'Tier 5': {color: '#000000', lineColor: '#80b535', danPoints: 50},
        'Dan': {color: '#8eb354', lineColor: '#000', danPoints: 50},
        'Dan 1': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 2': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 3': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 4': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 5': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 6': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 7': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 8': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 9': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 10': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 11': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 12': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 13': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 14': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 15': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 16': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 17': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 18': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 19': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 20': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 21': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 22': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 23': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 24': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 25': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 26': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 27': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 28': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 29': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 30': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Hall of Fame': {color: '#e3e13a', lineColor: '#e3e13a', danPoints: 50}
    }
    : {
        White: {color: '#eee', danPoints: 0},
        Yellow: {color: '#d3d31c', danPoints: 0},
        Orange: {color: '#d95b27', danPoints: 0},
        Green: {color: '#43833e', danPoints: 0},
        Blue: {color: '#3768b1', danPoints: 1},
        Purple: {color: '#6a4b9d', danPoints: 3},
        Brown: {color: '#624e38', danPoints: 6},
        Red: {color: '#b92121', danPoints: 10},
        Black: {color: '#000000', lineColor: '#acacac', danPoints: 18},
        'Black 1': {color: '#000000', lineColor: '#acacac', danPoints: 18},
        'Black 2': {color: '#000000', lineColor: '#acacac', danPoints: 24},
        'Black 3': {color: '#000000', lineColor: '#acacac', danPoints: 30},
        'Black 4': {color: '#000000', lineColor: '#acacac', danPoints: 36},
        'Black 5': {color: '#000000', lineColor: '#acacac', danPoints: 50},
        'Project': {color: '#000000', lineColor: '#c7c340', danPoints: 5},
        'Project 1': {color: '#000000', lineColor: '#c7c340', danPoints: 5},
        'Project 2': {color: '#000000', lineColor: '#c7c340', danPoints: 10},
        'Project 3': {color: '#000000', lineColor: '#c7c340', danPoints: 20},
        'Project 4': {color: '#000000', lineColor: '#c7c340', danPoints: 34},
        'Project 5': {color: '#000000', lineColor: '#c7c340', danPoints: 50},
        'Unranked': {color: '#000000', lineColor: '#d3d31c', danPoints: 0},
        'Tier 1': {color: '#000000', lineColor: '#80b535', danPoints: 5},
        'Tier 2': {color: '#000000', lineColor: '#80b535', danPoints: 10},
        'Tier 3': {color: '#000000', lineColor: '#80b535', danPoints: 20},
        'Tier 4': {color: '#000000', lineColor: '#80b535', danPoints: 34},
        'Tier 5': {color: '#000000', lineColor: '#80b535', danPoints: 50},
        'Dan': {color: '#8eb354', lineColor: '#000', danPoints: 50},
        'Dan 1': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 2': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 3': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 4': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 5': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 6': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 7': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 8': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 9': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 10': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 11': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 12': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 13': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 14': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 15': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 16': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 17': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 18': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 19': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 20': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 21': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 22': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 23': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 24': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 25': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 26': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 27': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 28': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 29': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Dan 30': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
        'Hall of Fame': {color: '#e3e13a', lineColor: '#e3e13a', danPoints: 50}
    }

export default belts
export const allBelts = Object.keys(belts)
export const allBeltsReverse = [...allBelts].reverse()
allBeltsReverse.push(allBeltsReverse.shift())

export const uniqueBelts = [
    'White',
    'Yellow',
    'Orange',
    'Green',
    'Blue',
    'Purple',
    'Brown',
    'Red',
    'Black'
]

export const danBelts = [
    'White',
    'Yellow',
    'Orange',
    'Green',
    'Blue',
    'Purple',
    'Brown',
    'Red',
    'Black 1',
    'Black 2',
    'Black 3',
    'Black 4',
    'Black 5',
    'Unranked',
    'Project'
]

export const danBeltsFull = [
    'White',
    'Yellow',
    'Orange',
    'Green',
    'Blue',
    'Purple',
    'Brown',
    'Red',
    'Black 1',
    'Black 2',
    'Black 3',
    'Black 4',
    'Black 5',
    'Unranked',
    'Project 1',
    'Project 2',
    'Project 3',
    'Project 4',
    'Project 5'
]

export const beltSort = (a, b) => {
    return allBelts.indexOf(a) - allBelts.indexOf(b)
}
export const beltSortReverse = (a, b) => {
    return allBeltsReverse.indexOf(a) - allBeltsReverse.indexOf(b)
}

export const projectTiers = {
    T1: {danPoints: 5},
    T2: {danPoints: 10},
    T3: {danPoints: 20},
    T4: {danPoints: 34},
    T5: {danPoints: 50}
}

export const modifierMultiplier = {
    'First Recorded Pick': 1.5,
    'First Recorded Pick (Notable)': 2.5,
    'Non-Picking Defeat': 0.75,
    'First Recorded Defeat': 1.5,
    'First Recorded Defeat (Notable)': 2,
    'Upgraded': 0
}
