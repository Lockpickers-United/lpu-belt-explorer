import {beltSort} from './belts'

const filterFields = [
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content', extraValues: ['Is Starred']}
]

export default filterFields

export const filterFieldsByFieldName = filterFields
    .reduce((acc, value) => ({
        ...acc,
        [value.fieldName]: value
    }), {id: {label: 'ID'}})
