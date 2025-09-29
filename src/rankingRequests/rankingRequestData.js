
export const requestStatuses = ['Submitted', 'Under Review', 'Ranked', 'Declined', 'Deleted']

export const statusSort = (a, b) => {
    return requestStatuses.indexOf(a) - requestStatuses.indexOf(b)
}
