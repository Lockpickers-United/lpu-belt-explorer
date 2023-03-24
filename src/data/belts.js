const belts = {
    White: {color: '#eee', danPoints: 0},
    Yellow: {color: '#d3d31c', danPoints: 0},
    Orange: {color: '#d95b27', danPoints: 0},
    Green: {color: '#43833e', danPoints: 0},
    Blue: {color: '#3768b1', danPoints: 1},
    Purple: {color: '#6a4b9d', danPoints: 3},
    Brown: {color: '#624e38', danPoints: 6},
    Red: {color: '#b92121', danPoints: 10},
    Black: {color: '#000000', lineColor: '#494949', danPoints: 18},
    'Black 1': {color: '#000000', lineColor: '#494949', danPoints: 18},
    'Black 2': {color: '#000000', lineColor: '#494949', danPoints: 24},
    'Black 3': {color: '#000000', lineColor: '#494949', danPoints: 30},
    'Black 4': {color: '#000000', lineColor: '#494949', danPoints: 36},
    'Black 5': {color: '#000000', lineColor: '#494949', danPoints: 50},
    Unranked: {color: '#000000', lineColor: '#d3d31c', danPoints: 0}
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

export const beltSort = (a, b) => {
    return allBelts.indexOf(a) - allBelts.indexOf(b)
}
export const beltSortReverse = (a, b) => {
    return allBeltsReverse.indexOf(a) - allBeltsReverse.indexOf(b)
}