const {VITE_DEV_FIRESTORE: devFirestore} = import.meta.env

export const nodeServer = devFirestore==='true' ? 'https://explore.lpubelts.com:3443' : 'https://explore.lpubelts.com:8443'
