import collectionOptions from '../data/collectionTypes'

export default function profileDB2State(dbRec) {
    if (dbRec) {
        const additionalFields = Object.keys(collectionOptions).reduce((acc, type) => {
            const anyKey = collectionOptions[type].map.find(c => c.entry === 'system:any')?.key
            const valKeys = collectionOptions[type].map.filter(c => c.entry !== 'system:any')?.map(c => c.key)
            if (anyKey) acc[anyKey] = [...new Set(valKeys.map(k => dbRec[k]).filter(k => k).flat())]
            return acc
        }, {})

        return {...dbRec, ...additionalFields}
    } else {
        return dbRec
    }
}
