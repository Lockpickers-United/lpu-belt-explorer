const {VITE_RAFL_STATE: raflState} = import.meta.env
// preview, live, post, hidden

export const lockSortFields = [
    {label: 'Default', value: undefined},
    {label: 'Alphabetical (Ascending)', value: 'alphaAscending'},
    {label: 'Alphabetical (Descending)', value: 'alphaDescending'},
    {label: 'Belt (Ascending)', value: 'beltAscending'},
    {label: 'Belt (Descending)', value: 'beltDescending'},
    {label: 'Popularity', value: 'popularity'},
    {label: 'Recently Updated', value: 'recentlyUpdated'},
    {label: 'Date Added', value: 'dateAdded'}
]

export const dialSortFields = [
    {label: 'Default', value: undefined},
    {label: 'UL Group (Ascending)', value: 'groupAscending'},
    {label: 'UL Group (Descending)', value: 'groupDescending'},
    {label: 'Difficulty Tier (Ascending)', value: 'tierAscending'},
    {label: 'Difficulty Tier (Descending)', value: 'tierDescending'},
    {label: 'Alphabetical (Ascending)', value: 'alphaAscending'},
    {label: 'Alphabetical (Descending)', value: 'alphaDescending'},
    {label: 'Recently Updated', value: 'recentlyUpdated'}
]

export const scorecardSortFields = [
    {label: 'Default', value: undefined},
    {label: 'Dan Points (Ascending)', value: 'danPointsAscending'},
    {label: 'Dan Points (Descending)', value: 'danPointsDescending'},
    {label: 'Date (Ascending)', value: 'dateAscending'},
    {label: 'Date (Descending)', value: 'dateDescending'},
    {label: 'Belt (Ascending)', value: 'beltAscending'},
    {label: 'Belt (Descending)', value: 'beltDescending'},
    {label: 'Alphabetical (Ascending)', value: 'alphaAscending'},
    {label: 'Alphabetical (Descending)', value: 'alphaDescending'}
]

export const raffleSortFields = raflState === 'preview'
    ? [
        {label: 'Default', value: undefined},
        {label: 'Pot Name', value: 'potName'},
        {label: 'Tickets', value: 'tickets'},
        {label: 'Donors', value: 'donors'},
        {label: 'Contributed By', value: 'contributedBy'},
        {label: 'Date Added', value: 'dateAdded'}
    ]
    : [
        {label: 'Default', value: undefined},
        {label: 'Pot Name', value: 'potName'},
        {label: 'Tickets', value: 'tickets'},
        {label: 'Donors', value: 'donors'},
        {label: 'Contributed By', value: 'contributedBy'},
    ]

export const raffleAdminSortFields = [
    {label: 'Default (Submitted)', value: undefined},
    {label: 'Recently Updated', value: 'updatedAt'},
    {label: 'Status', value: 'status'},
    {label: 'Username', value: 'username'},
    {label: 'Total Donation', value: 'totalDonation'},
]



export const lockRequestSortFields = [
    {label: 'Date Requested', value: undefined},
    {label: 'Alphabetical', value: 'alphaAscending'},
    {label: 'Alphabetical (Descending)', value: 'alphaDescending'},
    {label: 'Status', value: 'requestStatus'},
    {label: 'Request Count', value: 'requestCount'},
    {label: 'Recently Updated', value: 'recentlyUpdated'},
]

export const scorecardExploreSortFields = [
    {label: 'Default', value: undefined},
    {label: 'Alphabetical', value: 'alphaAscending'},
    {label: 'Belt (Ascending)', value: 'beltAscending'},
    {label: 'Belt (Descending)', value: 'beltDescending'},
]


