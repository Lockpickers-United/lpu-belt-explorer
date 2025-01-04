import fs from 'node:fs/promises'
import {localUser, prodUser} from '../../keys/users.js'

export async function raflCollectionUtils() {

    const production = process.env.USER !== localUser
    const backupDir = production
        ? `/home/${prodUser}/rafl-stats-temp/`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL`
    const backupFile = 'backup2.json'

    console.log('foo')

    try {
        const collections = JSON.parse(await fs.readFile(`${backupDir}/${backupFile}`, 'utf8'))

    } catch (e) {
        console.log(e)
    }

}

