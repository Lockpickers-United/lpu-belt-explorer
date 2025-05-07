import React, {useCallback, useMemo, useState} from 'react'
//import {jsonIt} from '../../util/jsonIt' //eslint-disable-line
import {ResponsiveSankey} from '@nivo/sankey'
//import sankeyData from './sankeyData.json'
//import {beltColors} from '../../admin/adminChartDefaults'
import {uniqueBelts} from '../../data/belts'
import Link from '@mui/material/Link'

export default function SankeyTest() {

    const fullData = useMemo(() => {
        return {
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
    }, [])
    const [sankeyData, setSankeyData] = useState(fullData)

    //const beltColorsOld = useMemo(() => { return ['#d5d5d5', '#d8d801', '#ed7d01', '#389700', '#0090de', '#634b9f', '#9d5918', '#ba0303', '#333', '#373737'] }, [])

    const beltColors = useMemo(() => {
        return ['#d5d5d5', '#dcdc1f', '#e16936', '#34732f',
            '#3e71bd', '#9f21e5', '#9d6837',
            '#c52323', '#333', '#373737']
    }, [])


    const [colors, setColors] = useState(beltColors)

    const [filter, setFilter] = useState(undefined)

    const handleReset = useCallback(() => {
        setSankeyData(fullData)
        setColors(beltColors)
        setFilter(undefined)
    }, [beltColors, fullData])


    const handleClick = useCallback((data) => {
        if (!data.label || data.label === 'White') return
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
        const newColors = beltColors.slice(idx)

        setSankeyData({nodes: newNodes, links: newLinks})
        setColors(newColors)
        setFilter(data.label)

    }, [beltColors, filter, fullData, handleReset])


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
                    align='justify'
                    colors={colors}
                    nodeOpacity={1}
                    nodeHoverOthersOpacity={0.2}
                    nodeThickness={22}
                    nodeInnerPadding={0}
                    nodeSpacing={20}
                    nodeBorderWidth={6}
                    nodeBorderColor={{from: 'color'}}
                    nodeBorderRadius={3}
                    linkOpacity={0.75}
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
                                3
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

                            <strong>{link.source.label}</strong> to
                            &nbsp;<strong>{link.target.label}</strong>
                            &nbsp;({link.value})
                        </div>}/>

            </div>
        </React.Fragment>
    )
}

