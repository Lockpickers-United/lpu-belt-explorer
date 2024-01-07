import React, {} from 'react'
import {ResponsiveWaffle} from '@nivo/waffle'
import {primaryTheme} from './chartDefaults.js'

function BrandBeltWaffle({beltData}) {

    const customBeltColors =
        ['#000', '#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#2c2c2c', '#000000']

    return (
        <React.Fragment>
            <div key='waffle' style={{height: 70, padding: '0px 8px', width: '100%', border: '0px solid #333'}}>

                <ResponsiveWaffle
                    data={beltData}
                    isInteractive={false}
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
        </React.Fragment>
    )
}

export default BrandBeltWaffle