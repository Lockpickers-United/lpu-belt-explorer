
export const serverUrl = 'https://explore.lpubelts.com:8443'

export const requestStatuses = ['Pending', 'Submitted', 'Under Review', 'Ranked', 'Completed', 'Declined', 'Deleted']

export const statusSort = (a, b) => {
    return requestStatuses.indexOf(a) - requestStatuses.indexOf(b)
}
