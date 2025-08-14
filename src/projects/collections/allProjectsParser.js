import {localUser, prodUser} from '../../../keys/users.js'
import fs from 'node:fs/promises'
import {setDeepAdd, setDeepUnique} from '../../util/setDeep.js'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`
const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

const allProjects = JSON.parse(await fs.readFile('./allProjects.json', 'utf8'))

const allProjectsData = allProjects.projects.reduce((acc, project) => {

    const targetBelt = ['Project 5']

    if (!targetBelt.includes(project.belt)) return acc

    console.log(project.displayName + '|' + project.evidenceName + '|' + project.date)

},[])