export default profile => {
    return [
        ...new Set([
            ...profile?.own || [],
            ...profile?.picked || [],
            ...profile?.recorded || [],
            ...profile?.wishlist || []
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
