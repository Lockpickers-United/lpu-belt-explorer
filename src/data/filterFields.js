import {beltSort} from './belts'

export const lockFilterFields = [
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content'},
    {label: 'Collection', fieldName: 'collection', userBased: true}
]

export const dialFilterFields = [
    {label: 'Make', fieldName: 'make'},
    {label: 'Fence Type', fieldName: 'fence'},
    {label: 'UL Group', fieldName: 'group'},
    {label: 'Wheels', fieldName: 'wheels'},
    {label: 'Digits', fieldName: 'digits'},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content'}
]
