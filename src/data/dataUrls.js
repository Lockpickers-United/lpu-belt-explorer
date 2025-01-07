const url = import.meta.env && import.meta.env.VITE_LOCAL_DATA === 'true'
    ? 'http://localhost:3000/data'
    : 'https://explore.lpubelts.com/data'

if (import.meta.env && import.meta.env.VITE_LOCAL_DATA === 'true') {
    console.info('Attention: App is using LOCAL DATA.')
}

export const brandDistribution = `${url}/statsBrandDistribution.json`
export const collectionsFull = `${url}/statsCollectionsFull2.json`
export const collectionsSummary = `${url}/statsCollectionsSummary2.json`
export const collectionsFullBB = `${url}/statsCollectionsFull2BB.json`

export const collectionsStatsCurrent = `${url}/collectionStatsCurrent.json`


export const lockSummary = `${url}/statsLockSummary.json`
export const popularAreas = `${url}/statsPopularAreas.json`
export const redditGrowth = `${url}/statsRedditGrowth.json`
export const siteFullNew = `${url}/statsSiteFullNew.json`
export const leaderboardData2 = `${url}/leaderboardData2.json`
export const unclaimedEvidence = `${url}/unclaimedEvidence.json`

export const raflJsonUrl = `${url}/rafl.json`
export const raflQuestionMap = `${url}/raflQuestionMap.json`
export const raflResponseDetails = `${url}/raflResponseDetails.json`
export const raflCollectionDetails = `${url}/raflCollectionDetails.json`
