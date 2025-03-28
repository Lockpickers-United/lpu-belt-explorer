import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import {jsonIt} from '../../util/jsonIt' //eslint-disable-line
import allEntries from '../../data/data.json'
import {setDeep, setDeepAdd} from '../../util/setDeep'
import {uniqueBelts} from '../../data/belts'

function TestPageRoute() {
    usePageTitle('Test Page')

    const ranked = allEntries.filter((entry) => entry.belt !== 'Unranked')

    const stats = ranked.reduce((acc, entry) => {
        const belt = entry.belt.replace(/\s\d+/, '')
        setDeepAdd(acc, ['totalsByBelt', belt], 1)
        entry.lockingMechanisms?.forEach(mech => {
            const mechanism = mech === 'Sidepins' || mech === 'Sidebar'
                ? 'Sidepins/Sidebar'
                : mech
            setDeepAdd(acc, ['totalsByMechanism', mechanism], 1)
            setDeepAdd(acc, ['totalsByBeltAndMechanism', belt, mechanism], 1)
            setDeepAdd(acc, ['totalsByMechanismandBelt', mechanism, belt], 1)

            setDeepAdd(acc, ['belts', mechanism, 'count'], 1)
            setDeep(acc, ['belts', mechanism, 'minBelt'], acc.belts[mechanism].minBelt === undefined || uniqueBelts.indexOf(belt) < uniqueBelts.indexOf(acc.belts[mechanism].minBelt)
                ? belt
                : acc.belts[mechanism].minBelt)
            setDeep(acc, ['belts', mechanism, 'maxBelt'], acc.belts[mechanism].maxBelt === undefined || uniqueBelts.indexOf(belt) > uniqueBelts.indexOf(acc.belts[mechanism].maxBelt)
                ? belt
                : acc.belts[mechanism].maxBelt)
        })
        return acc
    }, {})

    let output = ''
    const sorted = Object.keys(stats.belts)
        .map(belt => {
            return {belt, ...stats.belts[belt]}
        })
        .sort((a, b) => {
            return b.count - a.count
        })
        .map(beltInfo => {
            output += `${beltInfo.belt} ${beltInfo.count}   ${beltInfo.minBelt}-${beltInfo.maxBelt}\n`
            return beltInfo
        })


    console.log('sorted', sorted)

    //jsonIt('ranked', ranked)

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Test Page' extras={nav}/>

            <div style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16,
                padding: '0px 30px'
            }}>
                <pre>
                    {output}
                </pre>
            </div>

            <Footer/>
        </React.Fragment>
    )
}

export default TestPageRoute

