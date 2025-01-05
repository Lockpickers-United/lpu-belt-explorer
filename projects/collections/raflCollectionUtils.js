import fs from 'node:fs/promises'
import {localUser, prodUser} from '../../keys/users.js'
import {setDeep, setDeepAdd, setDeepMax} from '../util/useSetDeep.js'

export async function raflCollectionUtils() {

    const production = process.env.USER !== localUser
    const backupDir = production
        ? `/home/${prodUser}/firebase`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL`
    const backupFile = 'backup2.json'

    const saveDir = production
        ? `/home/${prodUser}/explore.lpubelts.com/public/data/`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/RAFL`

    try {
        const collections = JSON.parse(await fs.readFile(`${backupDir}/${backupFile}`, 'utf8'))
        const profiles = collections['__collections__']['lockcollections']

        const raffleWatchlistIds = Object.keys(profiles).filter(uid => profiles[uid].raffleWatchlist?.length > 0)
        const raffleWatchlists = raffleWatchlistIds.map(uid => {
            return {
                id: uid,
                raffleWatchlist: profiles[uid].raffleWatchlist
            }
        })

        const watchlistDetails = raffleWatchlists.reduce((acc, watchlist) => {
            const {id, raffleWatchlist} = watchlist
            raffleWatchlist.map(potId => {
                setDeepAdd(acc, ['potWatches', potId], 1)
                setDeepAdd(acc, ['allPotWatches'], 1)
            })
            setDeepMax(acc, ['potWatchMax'], raffleWatchlist.length)
            setDeepAdd(acc, ['potWatchCounts', raffleWatchlist.length], 1)
            return acc
        },{})

        setDeep(watchlistDetails, ['raffleWatchlistUsers'], raffleWatchlistIds.length)
        setDeep(watchlistDetails, ['raffleWatchlistAverage'], watchlistDetails.allPotWatches/raffleWatchlistIds.length)

        await fs.writeFile(`${saveDir}/raflCollectionDetails.json`, JSON.stringify(watchlistDetails, null, 2), function (err) {
            if (err) {
                console.error('save questionMap error:', err)
            }
        })

    } catch (e) {
        console.log(e)
    }

}

await raflCollectionUtils().then()
