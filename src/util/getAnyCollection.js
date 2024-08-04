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

export const anySafelockCollection = profile => {
    return [
        ...new Set([
            ...profile?.safelockOwn || [],
            ...profile?.safelockCracked || [],
            ...profile?.safelockWishlist || []
        ])
    ]
}
