import {google} from 'googleapis'
import dayjs from 'dayjs'
import fs from 'node:fs/promises'

const url = `https://docs.google.com/spreadsheets/d/1bGLLlSlGTRqLODNGrK-jrkQ7_lCBxCMuZ6pBWTxP98U/gviz/tq?tqx=out:csv&sheet=Form Responses 1&headers=1`
const csvData = await (await fetch(url)).text()

console.log('csvData', csvData)


export async function getFormResponses(auth, formId) {

    const formItems = await getFormItems(auth, formId)
    const questionMap = formItems.reduce((acc, item) => {
        acc[item.questionItem.question.questionId] = item.title
        return acc
    }, {})

    const forms = google.forms({version: 'v1', auth})
    const responses = (await forms.forms.responses.list({
        formId: formId
    })).data.responses

    if (responses?.length > 0) {
        const responseData = responses.map(res => {
            return Object.keys(res.answers).reduce((acc, key) => {
                if (questionMap[key] === 'Your Preferred Platform') {
                    acc.platform = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Platform Username') {
                    acc.username = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Selected charity') {
                    acc.charity = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Receipt from approved charity (hosted image link, must contain a visible date)') {
                    acc.receipt = res.answers[key].textAnswers.answers[0].value
                } else if (questionMap[key] === 'Total donation in USD') {
                    acc.donation = parseInt(res.answers[key].textAnswers.answers[0].value)
                } else {
                    acc.pots = acc.pots
                        ? {...acc.pots, [questionMap[key]]: parseInt(res.answers[key].textAnswers.answers[0].value)}
                        : {[questionMap[key]]: parseInt(res.answers[key].textAnswers.answers[0].value)}
                }
                acc.donor = `${acc.platform}-${acc.username}`
                acc.lastSubmittedTime = res.lastSubmittedTime
                return acc
            }, {})
        })

        const summaryData = responseData?.reduce((acc, res) => {

            acc.totalDonorCount = acc.totalDonorCount + 1 || 1

            acc.uniqueDonors = acc.uniqueDonors
                ? [...new Set([...acc.uniqueDonors, res.donor])]
                : [res.donor]
            acc.uniqueDonorCount = acc.uniqueDonors.length

            acc.totalDonations = acc.totalDonations + res.donation || res.donation

            acc.platformDonations = acc.platformDonations ? acc.platformDonations : {}
            acc.platformDonations[res.platform] = acc.platformDonations[res.platform] + res.donation
                || res.donation

            acc.platformDonors = acc.platformDonors ? acc.platformDonors : {}
            acc.platformDonors[res.platform] = acc.platformDonors[res.platform]
                ? [...new Set([...acc.platformDonors[res.platform], res.donor])]
                : [res.donor]
            acc.platformDonorCount = acc.platformDonorCount ? acc.platformDonorCount : {}
            acc.platformDonorCount[res.platform] = acc.platformDonors[res.platform].length

            acc.charityDonations = acc.charityDonations ? acc.charityDonations : {}
            acc.charityDonations[res.charity] = acc.charityDonations[res.charity] + res.donation
                || res.donation
            acc.charityDonations['total'] = acc.charityDonations['total'] + res.donation
                || res.donation

            acc.charityDonors = acc.charityDonors ? acc.charityDonors : {}
            acc.charityDonors[res.charity] = acc.charityDonors[res.charity]
                ? [...new Set([...acc.charityDonors[res.charity], res.donor])]
                : [res.donor]
            acc.charityDonorCount = acc.charityDonorCount ? acc.charityDonorCount : {}
            acc.charityDonorCount[res.charity] = acc.charityDonors[res.charity].length

            acc.potTickets = acc.potTickets ? acc.potTickets : {}
            acc.potDonors = acc.potDonors ? acc.potDonors : {}

            Object.keys(res.pots).map(key => {
                acc.potTickets[key] = acc.potTickets[key] + res.pots[key] || res.pots[key]
                acc.potTickets['total'] = acc.potTickets['total'] + res.pots[key] || res.pots[key]

                acc.potDonors[key] = acc.potDonors[key]
                    ? [...new Set([...acc.potDonors[key], res.donor])]
                    : [res.donor]
                acc.potDonorCount = acc.potDonorCount ? acc.potDonorCount : {}
                acc.potDonorCount[key] = acc.potDonors[key].length

            })

            return acc

        }, {})


        const detailedData = responseData?.reduce((acc, res) => {
            const date = dayjs(res.lastSubmittedTime).format('YYYY-MM-DD')

            setDeepAdd(acc, [date, 'totalDonors'], 1)
            setDeepAdd(acc, [date, 'totalDonations'], res.donation)
            setDeepAdd(acc, [date, 'platforms', res.platform, 'donors'], 1)
            setDeepAdd(acc, [date, 'platforms', res.platform, 'donations'], res.donation)
            setDeepAdd(acc, [date, 'charities', res.charity, 'donors'], 1)
            setDeepAdd(acc, [date, 'charities', res.charity, 'donations'], res.donation)
            Object.keys(res.pots).forEach(key => {
                setDeepAdd(acc, [date, 'pots', key, 'tickets'], res.pots[key])
                setDeepAdd(acc, [date, 'pots', key, 'donors'], 1)
            })

            return acc

        }, {})


        delete summaryData.uniqueDonors
        delete summaryData.platformDonors
        delete summaryData.charityDonors
        delete summaryData.potDonors
        summaryData.status = 'success'

        let dateString = dayjs().format('YYYY-MM-DD')

        /*
                await fs.writeFile(`${serverDir}/raflResponseDetails.json`, JSON.stringify(detailedData, null, 2), function (err) {
                    if (err) {
                        console.error('save raflResponseDetails error:', err)
                    }
                })

                await fs.writeFile(`${serverDir}/raflResponseSummary.json`, JSON.stringify(summaryData, null, 2), function (err) {
                    if (err) {
                        console.error('save raflResponseSummary error:', err)
                    }
                })

                await fs.writeFile(`${archiveDir}/raflResponseSummary-${dateString}.json`, JSON.stringify(summaryData, null, 2), function (err) {
                    if (err) {
                        console.error('archive raflResponseSummary error:', err)
                    }
                })
        */

        return summaryData
    }

    return {'warning': 'no form responses found'}
}


async function processResponses() {

    try {
        let filenames = (await fs.readdir(archiveDir))
            .filter(filename => filename.endsWith('.json'))
        const responses = []
        //console.log('filenames', filenames)

        for (const item of filenames) {
            const date = /.*-(\d{4}-\d{2}-\d{2})/.exec(item)[1]
            await fs.readFile(`${archiveDir}/${item}`, 'utf8').then((data) => {
                const dateResponses = JSON.parse(data)
                dateResponses.date = date
                responses.push(dateResponses)
            })
        }
        await fs.writeFile(`${serverDir}/raflHistoricalResponses.json`, JSON.stringify(responses, null, 2), function (err) {
            if (err) {
                console.error('save raflHistoricalResponses error:', err)
            }
        })

        return responses

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Directory not found:', error.message)
        } else if (error.code === 'EACCES') {
            console.error('Permission denied:', error.message)
        } else {
            console.error('Error reading directory:', error.message)
        }

        return {status: 'error', message: error.message}

    }
}

