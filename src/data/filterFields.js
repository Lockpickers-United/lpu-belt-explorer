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
    {label: 'Wheels', fieldName: 'wheels'},
    {label: 'UL Group', fieldName: 'group'},
    {label: 'Quest Tier', fieldName: 'tier'},
    {label: 'Fence Type', fieldName: 'fence'},
    {label: 'Digits', fieldName: 'digits'},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content'}
]

export const scorecardFilterFields = [
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
]

