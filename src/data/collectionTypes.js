const lockMap = [
    {key: 'any', label: 'Any', entry: 'system:any'},
    {key: 'own', label: 'Own', entry: 'checkbox'},
    {key: 'picked', label: 'Picked', entry: 'checkbox'},
    {key: 'wishlist', label: 'Wishlist', entry: 'checkbox'},
    {key: 'recordedLocks', label: 'Scorecard', entry: 'form'}
]

const safelockMap = [
    {key: 'safelocksAny', label: 'Any', entry: 'system:any'},
    {key: 'safelocksOwn', label: 'Own', entry: 'checkbox'},
    {key: 'safelocksCracked', label: 'Cracked', entry: 'checkbox'},
    {key: 'safelocksWishlist', label: 'Wishlist', entry: 'checkbox'}
]

const raffleMap = [
    {key: 'raffleWatchlistAny', label: 'Watchlist', entry: 'system:any'},
    {key: 'raffleWatchlist', label: 'Watchlist', entry: 'checkbox'}
]

const collectionOptions = {
    locks: {
        map: lockMap,
        keys: lockMap.map(l => l.key),
        labels: lockMap.map(l => l.label),
        keyByLabel: lockMap.reduce((acc, row) => {
            acc[row.label] = row.key
            return acc
        }, {}),
        getCollected: (profile) => profile ? profile[lockMap.find(l => l.entry === 'system:any').key] : []
    },

    safelocks: {
        map: safelockMap,
        keys: safelockMap.map(l => l.key),
        labels: safelockMap.map(l => l.label),
        keyByLabel: safelockMap.reduce((acc, row) => {
            acc[row.label] = row.key
            return acc
        }, {}),
        getCollected: (profile) => profile ? profile[safelockMap.find(l => l.entry === 'system:any').key] : []
    },

    raffle: {
        map: raffleMap,
        keys: raffleMap.map(l => l.key),
        labels: raffleMap.map(l => l.label),
        keyByLabel: raffleMap.reduce((acc, row) => {
            acc[row.label] = row.key
            return acc
        }, {}),
        getCollected: (profile) => profile ? profile[raffleMap.find(l => l.entry === 'system:any').key] : []
    }
}

export default collectionOptions
