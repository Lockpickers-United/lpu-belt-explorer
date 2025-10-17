import {beltSort} from './belts'
import {statusSort} from '../rankingRequests/rankingRequestData'

const collectionFieldValues = ['Any', 'Scorecard', 'Own', 'Picked', 'Wishlist', 'Not Any', 'Not Scorecard', 'Not Own', 'Not Picked', 'Not Wishlist', ]
const collectionFieldSort = (a, b) => {
    return collectionFieldValues.indexOf(a) - collectionFieldValues.indexOf(b)
}

const safelockCollectionFieldValues = ['Any', 'Own', 'Cracked', 'Wishlist', 'Not Any', 'Not Own', 'Not Cracked', 'Not Wishlist', ]
const safelockCollectionFieldSort = (a, b) => {
    return safelockCollectionFieldValues.indexOf(a) - safelockCollectionFieldValues.indexOf(b)
}

export const lockFilterFields = [
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Belt', fieldName: 'filterBelts', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content'},
    {label: 'Photographer', fieldName: 'photographers', beta: true},
    {label: 'Collection', fieldName: 'collection', sort: collectionFieldSort, userBased: true}
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
    {label: 'Collection', fieldName: 'collection', sort: safelockCollectionFieldSort, userBased: true}
]

export const scorecardFilterFields = [
    {label: 'Type', fieldName: 'type'},
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content'},
    {label: 'Documentation', fieldName: 'documentation'},
    {label: 'Scoring', fieldName: 'scoring'}
]

export const scorecardExploreFilterFields = [
    {label: 'User Belt', fieldName: 'userBelt', sort: beltSort},
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Lock Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Features', fieldName: 'features'},
    {label: 'Content', fieldName: 'content'},
    {label: 'Collection', fieldName: 'collection', userBased: true}
]


export const raffleFilterFields = [
    {label: 'Winner', fieldName: 'winner'},
    {label: 'Watchlist', fieldName: 'collection', userBased: true},
    {label: 'Tag', fieldName: 'tags'},
    {label: 'Contributor', fieldName: 'contributedBy'},
    {label: 'Country', fieldName: 'country'},
    {label: 'Shipping Type', fieldName: 'shippingType'},
    {label: 'Split Shipping', fieldName: 'splitShipping'},
]

export const lockRequestFilterFields = [
    {label: 'Status', fieldName: 'requestStatus', sort: statusSort},
    {label: 'Make', fieldName: 'makes'},
    {label: 'Locking Mechanism', fieldName: 'lockingMechanisms'},
    {label: 'Assigned Belt', fieldName: 'belt', sort: beltSort},
    {label: 'Suggested Belt', fieldName: 'approximateBelt', sort: beltSort},
    {label: 'User Belt', fieldName: 'userBelt', sort: beltSort},
]


