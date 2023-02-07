const filterFields = [
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Features', fieldName: 'features'},
    {label: 'Has Links', fieldName: 'hasLinks', values: ['true', 'false']},
    {label: 'Has Images', fieldName: 'hasImages', values: ['true', 'false']},
    {label: 'Starred', fieldName: 'starred', values: ['true', 'false']}
]

export default filterFields

export const filterFieldsByFieldName = filterFields
    .reduce((acc, {fieldName, label}) => ({
        ...acc,
        [fieldName]: label
    }), {id: 'ID'})