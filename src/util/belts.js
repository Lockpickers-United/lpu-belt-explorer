const belts = {
    White: {  danPoints: 0},
    Yellow: {  danPoints: 0},
    Orange: {  danPoints: 0},
    Green: {  danPoints: 0},
    Blue: {  danPoints: 1},
    Purple: {  danPoints: 3},
    Brown: {  danPoints: 6},
    Red: {  danPoints: 10},
    Black: {  danPoints: 18},
    'Black 1': {  danPoints: 18},
    'Black 2': {  danPoints: 24},
    'Black 3': {  danPoints: 30},
    'Black 4': {  danPoints: 36},
    'Black 5': {  danPoints: 50},
    'Project': {  danPoints: 5},
    'Project 1': {  danPoints: 5},
    'Project 2': {  danPoints: 10},
    'Project 3': {  danPoints: 20},
    'Project 4': {  danPoints: 34},
    'Project 5': {  danPoints: 50},
    Unranked: {  danPoints: 0},
    'Tier 1': {  danPoints: 5},
    'Tier 2': {  danPoints: 10},
    'Tier 3': {  danPoints: 20},
    'Tier 4': {  danPoints: 34},
    'Tier 5': {  danPoints: 50},
    Dan: {  danPoints: 50},
    'Dan 1': {  danPoints: 50},
    'Dan 2': {  danPoints: 50},
    'Dan 3': {  danPoints: 50},
    'Dan 4': {  danPoints: 50},
    'Dan 5': {  danPoints: 50},
    'Dan 6': {  danPoints: 50},
    'Dan 7': {  danPoints: 50},
    'Dan 8': {  danPoints: 50},
    'Dan 9': {  danPoints: 50},
    'Dan 10': {  danPoints: 50},
    'Dan 11': {  danPoints: 50},
    'Dan 12': {  danPoints: 50},
    'Dan 13': {  danPoints: 50},
    'Dan 14': {  danPoints: 50},
    'Dan 15': {  danPoints: 50},
    'Dan 16': {  danPoints: 50},
    'Dan 17': {  danPoints: 50},
    'Dan 18': {  danPoints: 50},
    'Dan 19': {  danPoints: 50},
    'Dan 20': {  danPoints: 50},
    'Dan 21': {  danPoints: 50},
    'Dan 22': {  danPoints: 50},
    'Dan 23': {  danPoints: 50},
    'Dan 24': {  danPoints: 50},
    'Dan 25': {  danPoints: 50},
    'Dan 26': {  danPoints: 50},
    'Dan 27': {  danPoints: 50},
    'Dan 28': {  danPoints: 50},
    'Dan 29': {  danPoints: 50},
    'Dan 30': {  danPoints: 50},
    'Hall of Fame': {  danPoints: 50},

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
    '30th Dan',
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
