import dayjs from 'dayjs'
import {setDeep, setDeepAdd} from '../src/util/setDeep.js'
import fs from 'fs'
import {itemDetails} from './getEntityDetails.js'

export async function saveLockStats() {

    const lockData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

    const lockStats = lockData
        .reduce((acc, lock) => {
            if (lock.belt === 'Unranked') {
                setDeepAdd(acc, ['lockBySegmentCounts', 'Unranked'], 1)
            } else {
                setDeepAdd(acc, ['lockBySegmentCounts', 'Ranked'], 1)
            }
            setDeepAdd(acc, ['lockBySegmentCounts', 'All'], 1)
            setDeepAdd(acc, ['locksByBeltCounts', lock.belt.replace(/ \d/, '')], 1)

            if (lock.lockingMechanisms) {
                if (lock.lockingMechanisms.length === 1) {
                    setDeepAdd(acc, ['locksByMechanism', lock.lockingMechanisms[0]], 1)
                } else {
                    setDeepAdd(acc, ['locksByMechanism', 'Multiple'], 1)
                }
            }

            return acc
        }, {})

    const lockCounts = Object.keys(lockStats.lockBySegmentCounts).map(segment => {
        return {
            value: lockStats.lockBySegmentCounts[segment],
            label: segment
        }
    })
    setDeep(lockStats, ['lockCounts', 'description'], 'Locks')
    setDeep(lockStats, ['lockCounts', 'data'], lockCounts)

    lockStats.locksByBelt = Object.keys(lockStats.locksByBeltCounts).map(belt => {
        return {
            belt,
            count: lockStats.locksByBeltCounts[belt],
            value: lockStats.locksByBeltCounts[belt] / lockStats.lockBySegmentCounts.All,
            id: belt
        }
    })
    delete lockStats.locksByBeltCounts

    lockStats.lockingMechanisms = Object.keys(lockStats.locksByMechanism).map(mechanism => {
        const id = mechanism.replaceAll(/[ |/]/g, '-').toLowerCase()
        return {
            label: mechanism,
            value: lockStats.locksByMechanism[mechanism],
            id
        }
    }).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    delete lockStats.locksByMechanism


// PHOTO STATS
    const topN = 250

    const photoCounts = lockData
        .reduce((acc, lock) => {
            if (lock.media) {
                setDeepAdd(acc, ['All locks'], 1)
                if (lock.belt !== 'Unranked') {
                    setDeepAdd(acc, ['Ranked locks'], 1)
                }
            }
            return acc
        }, {})

    lockData
        .filter((lock => lock.views))
        .sort((a, b) => b.views - a.views)
        .slice(0, topN)
        .forEach(() => {
            setDeepAdd(photoCounts, [`Top ${topN} locks`], 1)
        })

    const photoSegments = [
        {
            segment: `Top ${topN} locks`,
            count: topN,
            media: photoCounts[`Top ${topN} locks`],
            coverage: Math.floor((photoCounts[`Top ${topN} locks`] / topN) * 100) + '%'
        },
        {
            segment: 'Ranked locks',
            count: lockStats.lockBySegmentCounts.Ranked,
            media: photoCounts['Ranked locks'],
            coverage: Math.floor((photoCounts['Ranked locks'] / lockStats.lockBySegmentCounts.Ranked) * 100) + '%'
        },
        {
            segment: 'All locks',
            count: lockStats.lockBySegmentCounts.All,
            media: photoCounts['All locks'],
            coverage: Math.floor((photoCounts['All locks'] / lockStats.lockBySegmentCounts.All) * 100) + '%'
        }
    ]
    setDeep(lockStats, ['photoStats', 'photoSegments'], photoSegments)
    delete lockStats.lockBySegmentCounts


// IMAGE CONTRIBUTORS
    const allEntries = await itemDetails()
    const imageContributors = Object.keys(allEntries)
        .reduce((acc, entryId) => {
            if (!allEntries[entryId].media) return acc
            allEntries[entryId].media.map(media => {
                setDeep(acc, [media.fullSizeUrl], media.title?.replace('By: ', '').trim())
            })
            return acc
        }, {})

    const contributorCounts = Object.keys(imageContributors).reduce((acc, imageUrl) => {
        const contributor = imageContributors[imageUrl]
        if (contributor) {
            setDeepAdd(acc, [contributor], 1)
        }
        setDeepAdd(lockStats, ['photoStats', 'uniqueImages'], 1)
        setDeep(lockStats, ['photoStats', 'contributors'], new Set(Object.values(imageContributors)).size)
        return acc
    }, {})

    const topPhotographers = Object.keys(contributorCounts).map(contributor => {
        return {contributor: contributor, images: contributorCounts[contributor]}
    }).sort((a, b) => b.images - a.images || a.contributor.localeCompare(b.contributor))

    setDeep(lockStats, ['photoStats', 'topPhotographers'], topPhotographers)


// METADATA
    lockStats.metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}

//jsonIt('lockStats', lockStats)

    await fs.writeFile('./src/data/lockStats.json', JSON.stringify(lockStats, null, 2), function (err) {
        if (err) {
            console.error('save lockStats.json error:', err)
            return (`save lockStats.json error: ${err}`)
        } else {
            return ('lockStats.json saved')
        }
    })
}