const url = import.meta.env && import.meta.env.VITE_LOCAL_DATA === 'true'
    ? 'http://localhost:3000/data'
    : 'https://explore.lpubelts.com/data'

if (import.meta.env && import.meta.env.VITE_LOCAL_DATA === 'true') {
    console.info('Attention: App is using LOCAL DATA.')
}

export const brandDistribution = `${url}/statsBrandDistribution.json`
export const collectionsFull = `${url}/statsCollectionsFull.json`
export const collectionsSummary = `${url}/statsCollectionsSummary.json`
export const lockSummary = `${url}/statsLockSummary.json`
export const popularAreas = `${url}/statsPopularAreas.json`
export const redditGrowth = `${url}/statsRedditGrowth.json`
export const siteFull = `${url}/statsSiteFull.json`
export const siteSummary = `${url}/statsSiteSummary.json`
export const leaderboardData = `${url}/leaderboardData.json`
