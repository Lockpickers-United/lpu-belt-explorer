const belts = {
    White: {color: '#eee'},
    Yellow: {color: '#d3d31c'},
    Orange: {color: '#d95b27'},
    Green: {color: '#43833e'},
    Blue: {color: '#3768b1', dans: 1},
    Purple: {color: '#6a4b9d', dans: 3},
    Brown: {color: '#624e38', dans: 6},
    Red: {color: '#b92121', dans: 10},
    Black: {color: '#000000', lineColor: '#494949', dans: 18},
    'Black 1': {color: '#000000', lineColor: '#494949', dans: 18},
    'Black 2': {color: '#000000', lineColor: '#494949', dans: 24},
    'Black 3': {color: '#000000', lineColor: '#494949', dans: 30},
    'Black 4': {color: '#000000', lineColor: '#494949', dans: 36},
    'Black 5': {color: '#000000', lineColor: '#494949', dans: 50},
    Unranked: {color: '#000000', lineColor: '#d3d31c'}
}
export default belts
export const allBelts = Object.keys(belts)

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