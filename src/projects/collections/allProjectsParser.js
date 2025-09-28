import {localUser, prodUser} from '../../../keys/users.js'
import fs from 'node:fs/promises'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`

const allProjects = JSON.parse(await fs.readFile(`${serverDir}/allProjects.json`, 'utf8'))

const allProjectsData = allProjects.modifiers.reduce((acc, project) => {

    acc = acc || []
    const targetUser = 'GGplAdctTfVDLVvYsfIADJmfp8f2' // eslint-disable-line

    if (project.blackBelt === true) return acc

    //console.log(project.displayName + '|' + project.evidenceName + '|' + project.date)

    acc.push(project)
    return acc

},[])

console.log('allProjectsData', allProjectsData.length, allProjectsData)


try {
    await fs.writeFile(`${serverDir}/nonBBModified.json`, JSON.stringify(allProjectsData, null, 2))
} catch (err) {
    console.log(err)
}
