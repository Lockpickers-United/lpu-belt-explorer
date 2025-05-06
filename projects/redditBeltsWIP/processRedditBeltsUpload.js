import fs from 'fs'
import {localUser, prodUser} from '../../keys/users.js'
import {beltSort} from '../util/belts.js'
import formidable from '../util/formidable/src/index.js'
import authenticateRequest from '../util/authenticateRequest.js'


const uploadDir = `/home/${prodUser}/uploads`

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`

function handleError(res, message, error, status = 500) {
    console.error(message, error)
    res.status(status).send({status, message})
}

export default async function processRedditBeltsUpload(req, res) {

    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }

    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        filename() {
            return 'redditBeltsWIP.json'
        }
    })

    await form.parse(req, async function (err, fields, files) {
        if (err) {
            console.error('Form Parse Error', err)
            return handleError(res, 'A error occurred parsing the form', err, 500)
        }

        // Read the contents of the uploaded file
        const uploadedFilePath = `${uploadDir}/redditBelts.json`
        fs.readFile(uploadedFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err)
                return handleError(res, 'Error reading the uploaded file', err, 500)
            }

            // Now 'data' contains the file content
            //console.log('File contents:', data)

            const redditBeltData = JSON.parse(data)

            const beltCounts = redditBeltData.reduce((acc, user) => {
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


            fs.writeFileSync(`${serverDir}/redditBeltCounts.json`, JSON.stringify(beltCounts, null, 2), function (err) {
                if (err) {
                    return handleError(res, 'save redditBeltCounts.json error', err, 500)
                }
            })

            const beltCountsCsv = 'Belt,Count\n'
                + Object.keys(beltCounts)
                    .sort((a, b) => {
                        return beltSort(a.replace(' Belt', ''), b.replace(' Belt', ''))
                    })
                    .reduce((acc, role) => {
                        return acc + `${role},${beltCounts[role]}\n`
                    }, '')


            fs.writeFileSync(`${serverDir}/redditBeltCounts.csv`, beltCountsCsv, function (err) {
                if (err) {
                    return handleError(res, 'save redditBeltCounts.csv error', err, 500)
                }
            })

            try {
                fs.rmSync(`${uploadDir}/redditBelts.json`)
                console.log('uploaded data file removed successfully')
            } catch (error) {
                console.error('An error occurred deleteing uploaded data file', error.message)
                //res.status(500).send({status: 500, message: 'An error occurred deleting uploaded data file'})
                //return
            }

            // Send a response with the file contents (or handle as needed)
            res.status(200).send({
                message: 'File uploaded and read successfully!',
                data: beltCounts
            })
        })


    })

}
