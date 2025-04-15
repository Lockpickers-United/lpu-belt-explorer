const {VITE_DEV_FIRESTORE: devFirestore} = import.meta.env

export const serverUrl = devFirestore==='true' ? 'https://explore.lpubelts.com:3443' : 'https://explore.lpubelts.com:8443'

export const requestStatuses = ['Submitted', 'Under Review', 'Ranked', 'Declined', 'Deleted']

export const statusSort = (a, b) => {
    return requestStatuses.indexOf(a) - requestStatuses.indexOf(b)
}
