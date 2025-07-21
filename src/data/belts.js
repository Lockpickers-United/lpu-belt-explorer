// ['#eeeeee', '#dcdc1f', '#e16936', '#34732f', '#3e71bd', '#9f21e5', '#9d6837', '#c52323', '#000000']

const belts = {
    White: {color: '#eeeeee', danPoints: 0},
    Yellow: {color: '#dcdc1f', danPoints: 0},
    Orange: {color: '#e16936', danPoints: 0},
    Green: {color: '#34732f', danPoints: 0},
    Blue: {color: '#3e71bd', danPoints: 1},
    Purple: {color: '#9f21e5', danPoints: 3},
    Brown: {color: '#9d6837', danPoints: 6},
    Red: {color: '#c52323', danPoints: 10},
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
    'Dan 20': {color: '#ffff2c', lineColor: '#ffff2c', danPoints: 50},
    'Dan 21': {color: '#8eb354', lineColor: '#8eb354', danPoints: 50},
    'Hall of Fame': {color: '#e3e13a', lineColor: '#e3e13a', danPoints: 50},
    'Dan Points 5': {color: '#548fb3', lineColor: '#548fb3', danPoints: 5},
    'Dan Points 10': {color: '#548fb3', lineColor: '#548fb3', danPoints: 10},
    'Dan Points 25': {color: '#548fb3', lineColor: '#548fb3', danPoints: 25},
    'Dan Points 30': {color: '#548fb3', lineColor: '#548fb3', danPoints: 30},
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

export const beltRoles = [
    'White Belt',
    'Yellow Belt',
    'Orange Belt',
    'Green Belt',
    'Blue Belt',
    'Purple Belt',
    'Brown Belt',
    'Red Belt',
    'Black Belt',
    '1st Dan',
    '2nd Dan',
    '3rd Dan',
    '4th Dan',
    '5th Dan',
    '6th Dan',
    '7th Dan',
    '8th Dan',
    '9th Dan',
    '10th Dan',
    '11th Dan',
    '12th Dan',
    '13th Dan',
    '14th Dan',
    '15th Dan',
    '16th Dan',
    '17th Dan',
    '18th Dan',
    '19th Dan',
    '20th Dan',
    '21th Dan',
    '22th Dan',
    '23th Dan',
    '24th Dan',
    '25th Dan',
    '26th Dan',
    '27th Dan',
    '28th Dan',
    '29th Dan',
    '30th Dan'
]

export const beltSort = (a, b) => {
    return allBelts.indexOf(a) - allBelts.indexOf(b)
}
export const beltSortReverse = (a, b) => {
    return allBeltsReverse.indexOf(a) - allBeltsReverse.indexOf(b)
}


export const danBeltSort = (a, b) => {
    return danBeltsFull.indexOf(a) - danBeltsFull.indexOf(b)
}
export const danBeltsFullReverse = moveToLast([...danBeltsFull].reverse(), 'Unranked')
export const danBeltSortReverse = (a, b) => {
    return danBeltsFullReverse.indexOf(a) - danBeltsFullReverse.indexOf(b)
}

export const projectTiers = {
    T1: {danPoints: 5},
    T2: {danPoints: 10},
    T3: {danPoints: 20},
    T4: {danPoints: 34},
    T5: {danPoints: 50},
    T10: {danPoints: 5},
    T11: {danPoints: 10},
    T12: {danPoints: 25},
    T13: {danPoints: 30},
}

export const modifierMultiplier = {
    'First Recorded Pick': 1.5,
    'First Recorded Pick (Notable)': 2.5,
    'Non-Picking Defeat': 0.75,
    'First Recorded Defeat': 1.5,
    'First Recorded Defeat (Notable)': 2,
    'Upgraded': 0
}

////

function moveToLast(arr, value) {
    const index = arr.indexOf(value)
    if (index !== -1) {
        arr.splice(index, 1)
        arr.push(value)
    }
    return arr
}