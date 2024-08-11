export const collectionOptions = [
    {key: 'own', label: 'Own', entry: 'checkbox'},
    {key: 'picked', label: 'Picked', entry: 'checkbox'},
    {key: 'wishlist', label: 'Wishlist', entry: 'checkbox'},
    {key: 'recordedLocks', label: 'Scorecard', entry: 'form'}
]

export const validCollectionKeys = collectionOptions.map(c => c.key)
export const validCollectionTypes = collectionOptions.map(c => c.label)

export const safelockCollectionOptions = [
    {key: 'safelocksOwn', label: 'Own', entry: 'checkbox'},
    {key: 'safelocksCracked', label: 'Cracked', entry: 'checkbox'},
    {key: 'safelocksWishlist', label: 'Wishlist', entry: 'checkbox'}
]

export const safelocksValidCollectionKeys = safelockCollectionOptions.map(c => c.key)
export const safelocksValidCollectionTypes = safelockCollectionOptions.map(c => c.label)
