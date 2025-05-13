import {execFile} from 'child_process'
import {localUser, prodUser} from '../../../keys/users.js'
import fs from 'fs'

export default async function getRedditBelts(req, res) {

    function handleError(res, message, error, status = 500) {
        console.error(message, error)
        res.status(status).send({status, message})
    }

    let flairs = []

    const production = process.env.USER !== localUser
    const baseDir = production
        ? `/home/${prodUser}/explore-lpubelts-com-node`
        : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node`

    const serverDir = production
        ? `/home/${prodUser}/explore.lpubelts.com/public/data`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`


        execFile('python3', [`${baseDir}/src/projects/redditBelts/fetch_reddit_flairs.py`, baseDir], (error, stdout, stderr) => {
        if (error) {
            console.error('Python error:', error)
            console.error('stderr:', stderr)
            return
        }
        try {
            console.log('trying to parse stdout:', stdout)
            flairs = JSON.parse(stdout)
            if (!production) console.log(`Fetched ${flairs.length} flair entries`)
        } catch (err) {
            console.error('Error parsing output:', err)
            console.log('Raw output:', stdout)
            return handleError(res, 'Error parsing output', err)
        }

        const beltCounts = flairs.reduce((acc, user) => {
            let beltName = null

            const target = 'Legendary Black Belt'
            if (user.flair_text.includes(target)) {
                //console.log('found', target, user.user)
            }

            if (user.flair_text.match(/(.*)\sBelt/)) {
                const match = user.flair_text.match(/^.*?Belt/)
                beltName = match ? match[0] : null
                beltName = beltName === 'Legendary Black Belt' ? 'Black Belt' : beltName
            }
            if (beltName) {
                acc[beltName] = (acc[beltName] || 0) + 1
            }
            return acc
        }, {})

        const redditUserFlairs = flairs.reduce((acc, user) => {
            const match = user.flair_text.match(/^.*?Belt/)
            acc[user.user] = match ? match[0] : null
            return acc
        }, {})


        fs.writeFileSync(`${serverDir}/redditUserFlairs.json`, JSON.stringify(redditUserFlairs, null, 2), function (err) {
            if (err) {
                return handleError(res, 'save redditUserFlairs.json error', err, 500)
            }
        })

        fs.writeFileSync(`${serverDir}/redditBeltCounts.json`, JSON.stringify(beltCounts, null, 2), function (err) {
            if (err) {
                return handleError(res, 'save redditBeltCounts.json error', err, 500)
            }
        })

        req && res.status(200).send({
            message: `Flair data fetched & saved to ${serverDir}/redditBeltCounts.json`,
            data: beltCounts
        })


    })

}