import React from 'react'
//import {jsonIt} from '../../util/jsonIt' //eslint-disable-line
import {ResponsiveSankey} from '@nivo/sankey'
//import sankeyData from './sankeyData.json'
//import {beltColors} from '../../admin/adminChartDefaults'
export default function SankeyTest() {


    const sankeyData = {
        nodes: [
            {id: 'White', group: 1, total: 872},
            {id: 'Yellow', group: 1, total: 440},
            {id: 'Orange', group: 1, total: 305},
            {id: 'Green', group: 1, total: 106},
            {id: 'Blue', group: 1, total: 35},
            {id: 'Purple', group: 1, total: 12},
            {id: 'Brown', group: 1, total: 5},
            {id: 'Red', group: 1, total: 4},
            {id: 'Black', group: 1, total: 2}
        ],
        links: [
            {source: 'White', target: 'Yellow', value: 440},
            {source: 'White', target: 'Orange', value: 88},
            {source: 'White', target: 'Green', value: 15},
            {source: 'Yellow', target: 'Orange', value: 217},
            {source: 'Yellow', target: 'Green', value: 18},
            {source: 'Yellow', target: 'Blue', value: 1},
            {source: 'Orange', target: 'Green', value: 73},
            {source: 'Orange', target: 'Blue', value: 9},
            {source: 'Green', target: 'Blue', value: 25},
            {source: 'Green', target: 'Purple', value: 2},
            {source: 'Green', target: 'Red', value: 1},
            {source: 'Blue', target: 'Purple', value: 10},
            {source: 'Blue', target: 'Brown', value: 2},
            {source: 'Purple', target: 'Red', value: 1},
            {source: 'Purple', target: 'Brown', value: 3},
            {source: 'Red', target: 'Black', value: 1},
            {source: 'Brown', target: 'Red', value: 2}
        ]
    }

    const beltColors =
        ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#444', '#373737']

    return (
        <React.Fragment>
            <div style={{height: 600}}>
                <ResponsiveSankey
                    data={sankeyData}
                    layout='vertical'
                    sort='input'
                    margin={{top: 0, right: 0, bottom: 0, left: 0}}
                    align='justify'
                    colors={beltColors}
                    nodeOpacity={1}
                    nodeHoverOthersOpacity={0.2}
                    nodeThickness={22}
                    nodeSpacing={0}
                    nodeBorderWidth={0}
                    nodeBorderColor={{from: 'color'}}
                    nodeBorderRadius={3}
                    linkOpacity={0.75}
                    linkBlendMode={'normal'}
                    linkHoverOthersOpacity={0.1}
                    linkContract={15}
                    enableLinkGradient={false}
                    labelPosition='outside'
                    labelOrientation='horizontal'
                    labelPadding={-10}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'brighter',
                                2
                            ]
                        ]
                    }}
                    nodeTooltip={({node}) =>
                        <div style={{
                            fontSize: '0.8rem',
                            background: '#444',
                            padding: '3px 4px',
                            color: '#ddd',
                            borderRadius: '5px'
                        }}>
                            <strong>{node.label}: {node.total}</strong>
                        </div>}
                    linkTooltip={({link}) =>
                        <div style={{
                            fontSize: '0.8rem',
                            background: '#666',
                            padding: '3px 4px',
                            color: '#ddd',
                            borderRadius: '5px'
                        }}>

                            <strong>{link.source.label}</strong> to <strong>{link.target.label}</strong> ({link.value})
                        </div>}/>

            </div>
        </React.Fragment>
    )
}

