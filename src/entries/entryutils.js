import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import nextUpgrades from '../data/upgrades.json'

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

export function isUpgradeOf(aId, bId) {
    if (!nextUpgrades[bId]) {
        return false
    } else if (nextUpgrades[bId].includes(aId)) {
        return true
    } else {
        return nextUpgrades[bId].some(id => isUpgradeOf(aId, id))
    }
}


