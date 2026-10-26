const allGroups = [
    '',
    '2',
    '2M',
    '1',
    '1R',
    'zzz'
]

const allGroupsReverse = [...allGroups].reverse()

export const groupSort = (a, b) => {
    return allGroups.indexOf(a) - allGroups.indexOf(b)
}

export const groupSortReverse = (a, b) => {
    return allGroupsReverse.indexOf(a) - allGroupsReverse.indexOf(b)
}
