export default profile => {
    return [
        ...new Set([
            ...profile?.own || [],
            ...profile?.picked || [],
            ...profile?.wishlist || [],
            ...profile?.recordedLocks || []
        ])
    ]
}

export const getAnySafelockCollection = profile => {
    return [
        ...new Set([
            ...profile?.safelocksOwn || [],
            ...profile?.safelockCracked || [],
            ...profile?.safelockWishlist || []
        ])
    ]
}
