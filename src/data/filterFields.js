const filterFields = [
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Features', fieldName: 'features'},
    {label: 'Has Links', fieldName: 'hasLinks'},
    {label: 'Has Images', fieldName: 'hasImages'}
]

export default filterFields

export const filterFieldsByFieldName = filterFields
    .reduce((acc, {fieldName, label}) => ({
        ...acc,
        [fieldName]: label
    }), {id: 'ID'})