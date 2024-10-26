import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import allAwards from '../data/awards.json'
import nextUpgrades from '../data/upgrades.json'
import {beltSort} from '../data/belts'

export const allEntriesById = allEntries
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

export function getEntryFromId(id) {
    return allEntriesById[id]
}

export function isLock(id) {
    return Boolean(allEntriesById[id])
}

export const allProjectsById = allProjects
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

export function getProjectEntryFromId(id) {
    return allProjectsById[id]
}

export function isProject(id) {
    return Boolean(allProjectsById[id])
}


export const allAwardsById = allAwards
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

export function getAwardEntryFromId(id) {
    return allAwardsById[id]
}

export const blackBeltAwardId = 'da7759a9'

export function lookupAwardByBelt(belt, danLevel, fullname) {
    if (danLevel) {
        return allAwards.find(a => a.belt === 'Dan ' + danLevel)
    } else if (belt) {
        return allAwards.find(a => a.belt.toLowerCase() === belt.toLowerCase())
    } else if (fullname) {
        return allAwards.find(a => a.belt.toLowerCase() === fullname.toLowerCase())
    } else {
        return null
    }
}

export function awardGreaterThan(awardA, awardB) {
    if (!awardA) {
        return false
    } else if (!awardB || awardA.awardType === 'dan' && awardB.awardType === 'belt') {
        return true
    } else if (awardA.awardType === awardB.awardType) {
        return awardA.rank > awardB.rank
    } else {
        return false
    }
}

export function isAward(id) {
    return Boolean(allAwardsById[id])
}


export const possibleUpgrades = Object.keys(nextUpgrades)
    .reduce((group, term) => {
        group[term] = true
        nextUpgrades[term].forEach(id => {
            group[id] = true
        })
        return group
    }, {})

const prevUpgrades = Object.keys(nextUpgrades)
    .reduce((group, term) => {
        nextUpgrades[term].forEach(id => {
            if (!group[id]) {
                group[id] = [term]
            } else if (!group[id].includes(term)) {
                group[id] = [...group[id], term]
            }
        })
        return group
    }, {})

function baseVersions(id) {
    if (prevUpgrades[id]) {
        return prevUpgrades[id].map(p => baseVersions(p)).flat()
    } else {
        return [id]
    }
}

function upgradesFrom(id) {
    if (nextUpgrades[id]) {
        return [id, nextUpgrades[id].map(n => upgradesFrom(n)).flat()].flat()
    } else {
        return [id]
    }
}

export function upgradeTree(id) {
    const allIds = baseVersions(id).map(b => upgradesFrom(b)).flat()
    return [...new Set(allIds)]
}

const maxBaseArraysByBase = Object.keys(possibleUpgrades)
    .map(id => baseVersions(id))
    .reduce((acc, currentBases) => {
        // Need to combine and reduce sets of bases that overlap.
        // To do this, we form a hash where each base id points to maximal 
        // array of bases that ultimately intersect with the given base id 
        // in the graph.
        currentBases.forEach(newBase => {
            if (!acc[newBase]) {
                // This is a new base, so start with the array where we found it.
                acc[newBase] = currentBases
            } else {
                // We've seen this base before, but perhaps as part of different set.
                // So combine the two sets.
                acc[newBase] = [...new Set([...acc[newBase], ...currentBases].flat())]
            }
        })
        return acc
    }, {})

export const allUpgradesPartitioned = Object.keys(maxBaseArraysByBase)
    .reduce((acc, base) => {
        // Need to identify the uniq sets of base arrays. Each will
        // correspond with a distinct partition that we are after.
        const baseArray = maxBaseArraysByBase[base]
        const uniqKey = baseArray.sort().toString()

        if (!acc.keys[uniqKey]) {
            acc.keys[uniqKey] = true
            acc.result = [...acc.result, baseArray]
        }
        return acc
}, {keys: {}, result: []}).result
    .map(basePartition => {
        // We have our partitions, at least by base. Following
        // each up the upgrade tree and combining will give full
        // partition.
        const partition = [...new Set(basePartition.map(base => upgradesFrom(base)).flat())]
        return partition.sort((a, b) => beltSort((allEntriesById[a] || allProjectsById[a]).belt, 
                                                 (allEntriesById[b] || allProjectsById[b]).belt))
})

export function isUpgradeOf(aId, bId) {
    if (!nextUpgrades[bId]) {
        return false
    } else if (nextUpgrades[bId].includes(aId)) {
        return true
    } else {
        return nextUpgrades[bId].some(id => isUpgradeOf(aId, id))
    }
}
