import React, {useCallback, useState} from 'react'
//import {jsonIt} from '../../util/jsonIt' //eslint-disable-line
import {ResponsiveSankey} from '@nivo/sankey'
import fullData from './sankeyData.json'
import {beltColorsNew} from '../../admin/adminChartDefaults'
import {uniqueBelts} from '../../data/belts'
import Link from '@mui/material/Link'

export default function BeltFlowSankey() {

    const [sankeyData, setSankeyData] = useState(fullData)
    const [colors, setColors] = useState(beltColorsNew)
    const [filter, setFilter] = useState(undefined)

    const touchTap = isTouchDevice()

    const handleReset = useCallback(() => {
        setSankeyData(fullData)
        setColors(beltColorsNew)
        setFilter(undefined)
    }, [])

    const handleClick = useCallback((data) => {
        if (touchTap) return
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

    }, [filter, handleReset, touchTap])


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

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches)
}
