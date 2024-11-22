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
    {label: 'Content', fieldName: 'content'},
    {label: 'Collection', fieldName: 'collection', userBased: true}
]

export const scorecardFilterFields = [
    {label: 'Type', fieldName: 'type'},
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
    {label: 'Documentation', fieldName: 'documentation'},
    {label: 'Scoring', fieldName: 'scoring'}
]

export const raffleFilterFields = [
    {label: 'Tag', fieldName: 'tags'},
    {label: 'Contributor', fieldName: 'contributedBy'},
    {label: 'Country', fieldName: 'country'},
    {label: 'Watchlist', fieldName: 'collection', userBased: true}
]

