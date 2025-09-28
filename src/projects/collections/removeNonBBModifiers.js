import {localUser, prodUser} from '../../../keys/users.js'
import fs from 'node:fs/promises'

import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore, FieldValue} from 'firebase-admin/firestore'


const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`
const keysDir = production
    ? `/home/${prodUser}/explore-lpubelts-com-node/keys`
    : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/keys`

const serviceAccount = JSON.parse(await fs.readFile(`${keysDir}/service-account.json`, 'utf8'))

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
//const dbDev = getFirestore(firebaseApp, 'lpubelts-dev')
const dbProd = getFirestore(firebaseApp)

const allProjects = JSON.parse(await fs.readFile(`${serverDir}/allProjects.json`, 'utf8'))

const allProjectsData = allProjects.modifiers.reduce((acc, project) => {

    acc = acc || []
    if (project.blackBelt === true) return acc
    acc.push(project)
    return acc

},[])


async function removeModifiersForAllProjects({dryRun = true, _concurrency = 10} = {}) {
    console.log(`removeModifiersForAllProjects starting. total=${allProjectsData.length} dryRun=${dryRun}`)
    let success = 0
    let failed = 0

    for (const project of allProjectsData) {
        const evidenceId = project.docId
        if (!evidenceId) {
            console.warn('Skipping entry without docId:', project)
            failed++
            continue
        }
        try {
            if (dryRun) {
                console.log(`[DRY RUN] Would delete 'modifier' from evidence/${evidenceId}`)
            } else {
                await dbProd.collection('evidence').doc(evidenceId).update({ modifier: FieldValue.delete() })
                console.log(`Deleted 'modifier' from evidence/${evidenceId}`)
            }
            success++
        } catch (err) {
            failed++
            console.error(`Failed to update evidence/${evidenceId}:`, err?.message || err)
        }
    }
    console.log(`removeModifiersForAllProjects complete. success=${success} failed=${failed}`)
}

try {
    await removeModifiersForAllProjects({dryRun: true})
} catch (err) {
    console.log(err)
}


try {
    //await fs.writeFile(`${serverDir}/nonBBModified.json`, JSON.stringify(allProjectsData, null, 2))
} catch (err) {
    console.log(err)
}
