import React from 'react'
import AdminStatsTable from '../AdminStatsTable'
import useWindowSize from '../../util/useWindowSize'

const ScreenWidthsTable = ({data}) => {

    const widths = [360, 375, 384, 393, 412, 414, 428, 430, 1024, 1440, 1536, 1920, 2560, 3440]

    const summaryData = data['screenWidths'].data.reduce((acc, res) => {
        if (res.width < 360) {
            acc['359-'] = acc['359-'] ? acc['359-'] + res.lockViews : res.lockViews
        }
        widths.map(width => {
            const widthString = width + ''
            if (res.width === width) {
                acc[widthString] = acc[widthString] ? acc[widthString] + res.lockViews : res.lockViews
            }
        })
        acc['total'] = acc['total'] ? acc['total'] + res.lockViews : res.lockViews
        return acc
    }, {})

    const cumulativeData = data['screenWidths'].data.reduce((acc, res) => {
        if (res.width < 360) {
            acc['359-'] = acc['359-'] ? acc['359-'] + res.lockViews : res.lockViews
        }
        widths.map(width => {
            const widthString = width + ''
            if (res.width <= width) {
                acc[widthString] = acc[widthString] ? acc[widthString] + res.lockViews : res.lockViews
            }
        })
        acc['total'] = acc['total'] ? acc['total'] + res.lockViews : res.lockViews
        return acc
    }, {})

    const totals = Object.keys(summaryData).sort((a, b) => {
        return a - b
    }).filter(x => x!== 'total' && x !== '359-')

    const summaryRows = totals.map(width => {
        return {
            lockViews: summaryData[width],
            width: width,
            percentViews: Math.floor(summaryData[width] / summaryData['total'] * 100) + '%',
            cumulativeViews: Math.floor(cumulativeData[width] / summaryData['total'] * 100) + '%'
        }
    })

    summaryRows.unshift({
        lockViews: summaryData['359-'],
        width: '359-',
        percentViews: Math.floor(summaryData['359-'] / summaryData['total'] * 100) + '%',
        cumulativeViews: Math.floor(cumulativeData['359-'] / summaryData['total'] * 100) + '%'
    })

    summaryRows.push({
        lockViews: summaryData['total'],
        width: 'total',
        percentViews: '100%',
        cumulativeViews: '100%'
    })

    const tableData = {
        columns: [...data['screenWidths'].columns,
            {'name': 'Percent Views', 'align': 'center', 'id': 'percentViews'},
            {'name': 'Cumulative Views', 'align': 'center', 'id': 'cumulativeViews'}
        ],
        data: summaryRows
    }

    const {width} = useWindowSize()
    const mobile360 = width <= 360
    const mobile395 = width <= 395
    const mobile428 = width <= 428  // but test also at 412
    const window560 = width <= 560
    const window820 = width <= 820

    const fontSize = mobile360 ? '.8rem'
        : mobile395 ? '.85rem'
            : mobile428 ? '.9rem'
                : window560 ? '.9rem'
                    : window820 ? '.9rem'
                        : '.85rem'

    const tableWidth = 550
    const tableHeight = 650

    return (
        <div>
            <AdminStatsTable
                tableData={tableData}
                tableWidth={tableWidth}
                tableHeight={tableHeight}
                fontSize={fontSize}
            />
        </div>
    )
}

export default ScreenWidthsTable
