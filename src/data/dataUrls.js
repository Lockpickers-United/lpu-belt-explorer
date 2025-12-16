const url = import.meta.env && import.meta.env.VITE_LOCAL_DATA === 'true'
    ? 'http://localhost:3000/data'
    : 'https://explore.lpubelts.com/data'

if (import.meta.env && import.meta.env.VITE_LOCAL_DATA === 'true') {
    console.info('Attention: App is using LOCAL DATA.')
}

export const lockbazzarEntryIds = 'https://data.lpulocks.com/lockbazaar/lockbazzarEntryIds.json'

export const collectionsStatsCurrent = `${url}/collectionStatsCurrent.json`
export const collectionStatsDaily = `${url}/collectionStatsDaily.json`
export const leaderboardData = `${url}/leaderboardData.json`
export const recentAwardsEvidence = `${url}/recentAwardsEvidence.json`
export const allProjectsEvidence = `${url}/allProjectsEvidence.json`

export const pickStatsData = `${url}/pickStats.json`
export const scorecardStats = `${url}/scorecardStats.json`
export const discordBeltCounts = `${url}/discordBeltCounts.json`
export const redditBeltCounts = `${url}/redditBeltCounts.json`

export const brandDistribution = `${url}/statsBrandDistribution.json`
export const popularAreas = `${url}/statsPopularAreas.json`
export const redditGrowth = `${url}/statsRedditGrowth.json`
export const siteFullNew = `${url}/statsSiteFullNew.json`

export const unclaimedEvidence = `${url}/unclaimedEvidence.json`

export const raflSiteStats = `${url}/statsSiteFullNew.json`
export const raflPreviewPots = `${url}/raflPreviewPots.json`
export const raflPreviewVersion = `${url}/raflPreviewVersion.json`
export const raflResponseDetails = `${url}/raflResponseDetails.json`
export const raflCollectionDetails = `${url}/raflCollectionDetails.json`

const {VITE_DEV_FIRESTORE: devFirestore} = import.meta.env
export const nodeServerUrl = devFirestore==='true' ? 'https://explore.lpubelts.com/servicesDev' : 'https://explore.lpubelts.com/services'
