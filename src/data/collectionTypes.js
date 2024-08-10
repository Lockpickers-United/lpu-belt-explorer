export const collectionOptions = [
    {key: 'own', label: 'Own'},
    {key: 'picked', label: 'Picked'},
    {key: 'wishlist', label: 'Wishlist'}
]

export const validCollectionKeys = collectionOptions.map(c => c.key)
export const validCollectionTypes = collectionOptions.map(c => c.label)

export const safelockCollectionOptions = [
    {key: 'safelocksOwn', label: 'Own'},
    {key: 'safelocksCracked', label: 'Cracked'},
    {key: 'safelocksWishlist', label: 'Wishlist'}
]

export const safelocksValidCollectionKeys = safelockCollectionOptions.map(c => c.key)
export const safelocksValidCollectionTypes = safelockCollectionOptions.map(c => c.label)
