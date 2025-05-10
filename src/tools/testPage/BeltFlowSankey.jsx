import React, {useCallback, useMemo, useState} from 'react'
//import {jsonIt} from '../../util/jsonIt' //eslint-disable-line
import {ResponsiveSankey} from '@nivo/sankey'
//import sankeyData from './sankeyData.json'
import {beltColorsNew} from '../../admin/adminChartDefaults'
import {uniqueBelts} from '../../data/belts'
import Link from '@mui/material/Link'

export default function BeltFlowSankey() {

    const fullData = useMemo(() => {
        return {
            nodes: [
                {id: 'White', group: 1, total: 430},
                {id: 'Yellow', group: 1, total: 749},
                {id: 'Orange', group: 1, total: 1204},
                {id: 'Green', group: 1, total: 609},
                {id: 'Blue', group: 1, total: 243},
                {id: 'Purple', group: 1, total: 123},
                {id: 'Brown', group: 1, total: 81},
                {id: 'Red', group: 1, total: 70},
                {id: 'Black', group: 1, total: 169}
            ],
            links: [
                {source: 'White', target: 'Yellow', value: 533},
                {source: 'White', target: 'Orange', value: 119},
                {source: 'White', target: 'Green', value: 13},
                {source: 'White', target: 'Blue', value: 4},
                {source: 'White', target: 'Purple', value: 3},
                {source: 'White', target: 'Brown', value: 1},
                {source: 'White', target: 'Red', value: 1},
                {source: 'Yellow', target: 'Orange', value: 728},
                {source: 'Yellow', target: 'Green', value: 82},
                {source: 'Yellow', target: 'Blue', value: 9},
                {source: 'Yellow', target: 'Purple', value: 1},
                {source: 'Yellow', target: 'Red', value: 1},
                {source: 'Orange', target: 'Green', value: 512},
                {source: 'Orange', target: 'Blue', value: 28},
                {source: 'Orange', target: 'Purple', value: 3},
                {source: 'Orange', target: 'Black', value: 2},
                {source: 'Green', target: 'Blue', value: 337},
                {source: 'Green', target: 'Purple', value: 41},
                {source: 'Green', target: 'Brown', value: 10},
                {source: 'Green', target: 'Red', value: 7},
                {source: 'Green', target: 'Black', value: 4},
                {source: 'Blue', target: 'Purple', value: 194},
                {source: 'Blue', target: 'Brown', value: 27},
                {source: 'Blue', target: 'Red', value: 6},
                {source: 'Blue', target: 'Black', value: 9},
                {source: 'Purple', target: 'Brown', value: 146},
                {source: 'Purple', target: 'Red', value: 15},
                {source: 'Purple', target: 'Black', value: 10},
                {source: 'Brown', target: 'Red', value: 117},
                {source: 'Brown', target: 'Black', value: 12},
                {source: 'Red', target: 'Black', value: 98}
            ]
        }

    }, [])
    const [sankeyData, setSankeyData] = useState(fullData)

    //const beltColorsOld = useMemo(() => { return ['#d5d5d5', '#d8d801', '#ed7d01', '#389700', '#0090de', '#634b9f', '#9d5918', '#ba0303', '#333', '#373737'] }, [])


    const [colors, setColors] = useState(beltColorsNew)

    const [filter, setFilter] = useState(undefined)

    const handleReset = useCallback(() => {
        setSankeyData(fullData)
        setColors(beltColorsNew)
        setFilter(undefined)
    }, [fullData])


    const handleClick = useCallback((data) => {
        if (!data.label || data.label === 'White' || data.label === 'Black') return
        if (data.label === filter) {
            handleReset()
            return
        }
        const {nodes, links} = {...fullData}
        const idx = uniqueBelts.indexOf(data.label)
        const removeBelts = uniqueBelts.slice(0, idx)

        const newNodes = nodes.filter(node => {
            return !removeBelts.includes(node.id)
        })
        const newLinks = links.filter(link => {
            return !removeBelts.includes(link.source) && !removeBelts.includes(link.target)
        })
        const newColors = beltColorsNew.slice(idx)

        setSankeyData({nodes: newNodes, links: newLinks})
        setColors(newColors)
        setFilter(data.label)

    }, [filter, fullData, handleReset])


    return (
        <React.Fragment>
            <div style={{textAlign: 'center', height: 20, marginBottom: 5, fontSize: '0.9rem'}}>
                {filter &&
                    <Link onClick={handleReset} style={{color: '#ddd', cursor: 'pointer'}}>Reset</Link>
                    || <span>Click belt for details</span>
                }
            </div>

            <div style={{height: 600}}>
                <ResponsiveSankey
                    data={sankeyData}
                    layout='vertical'
                    sort='input'
                    margin={{top: 10, right: 10, bottom: 20, left: 10}}
                    align='center'
                    colors={colors}
                    nodeOpacity={1}
                    nodeHoverOthersOpacity={0.2}
                    nodeThickness={22}
                    nodeInnerPadding={0}
                    nodeSpacing={0}
                    nodeBorderWidth={1}
                    nodeBorderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.5
                            ]
                        ]
                    }}
                    nodeBorderRadius={3}
                    linkOpacity={0.6}
                    linkBlendMode={'normal'}
                    linkHoverOthersOpacity={0.1}
                    linkContract={-0.5}
                    enableLinkGradient={false}
                    labelPosition='outside'
                    labelOrientation='horizontal'
                    labelPadding={-10}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'brighter',
                                5
                            ]
                        ]
                    }}
                    onClick={(data) => {
                        handleClick(data)
                    }}
                    nodeTooltip={({node}) =>
                        <div style={{
                            fontSize: '0.8rem',
                            background: '#444',
                            padding: '3px 4px',
                            color: '#ddd',
                            borderRadius: '5px'
                        }}>
                            <strong>{node.label}: {node['total']}</strong>
                        </div>}
                    linkTooltip={({link}) =>
                        <div style={{
                            fontSize: '0.8rem',
                            background: '#666',
                            padding: '3px 4px',
                            color: '#ddd',
                            borderRadius: '5px'
                        }}>
                            <strong>{link.source.label}</strong> to <strong>{link.target.label}</strong>
                            &nbsp;({link.value})
                        </div>
                    }/>
            </div>
        </React.Fragment>
    )
}

