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
