import React, {} from 'react'
import {ResponsiveWaffle} from '@nivo/waffle'
import {primaryTheme} from './chartDefaults.js'

function BrandBeltWaffle({beltData}) {

    const customBeltColors =
        ['#000', '#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#2c2c2c', '#000000']

    const lockCounts = new Map()
    beltData.map(function (element) {
        lockCounts.set(element.label, element.count)
    })

    return (
            <div key='waffle' style={{height: 70, padding: '0px 8px', width: '100%', border: '0px solid #333'}}>

                <ResponsiveWaffle
                    data={beltData}
                    isInteractive={true}
                    tooltip={(e) => lockCounts.get(e.data.label) ?
                        <div style={{
                            padding: '4px 12px', background: '#1a1a1a', fontSize: '.82rem', color: '#ccc'
                        }}>
                            {e.data.label} - {lockCounts.get(e.data.label)}
                        </div>
                        : null
                    }
                    fillDirection='right'
                    total={1}
                    rows={4}
                    columns={30}
                    padding={1.4}
                    valueFormat='.2f'
                    margin={{top: 0, right: 0, bottom: 0, left: 0}}
                    colors={customBeltColors}
                    borderRadius={3}
                    motionStagger={2}
                    theme={primaryTheme}
                />

            </div>
    )
}

export default BrandBeltWaffle