const belts = {
    White: {color: '#eee'},
    Yellow: {color: '#d3d31c'},
    Orange: {color: '#d95b27'},
    Green: {color: '#43833e'},
    Blue: {color: '#3768b1'},
    Purple: {color: '#6a4b9d'},
    Brown: {color: '#624e38'},
    Red: {color: '#b92121'},
    Black: {color: '#000000', lineColor: '#494949'},
    'Black 1': {color: '#000000', lineColor: '#494949'},
    'Black 2': {color: '#000000', lineColor: '#494949'},
    'Black 3': {color: '#000000', lineColor: '#494949'},
    'Black 4': {color: '#000000', lineColor: '#494949'},
    'Black 5': {color: '#000000', lineColor: '#494949'},
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