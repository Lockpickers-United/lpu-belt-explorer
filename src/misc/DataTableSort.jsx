import React, {useCallback, useState} from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import Link from '@mui/material/Link'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import IconButton from '@mui/material/IconButton'
import useWindowSize from '../util/useWindowSize.jsx'

const DataTableSort = ({
                           tableData,
                           tableWidth,
                           tableHeight,
                           linkFunction,
                           totalsRow
                       }) => {


    const {rows, columns, defaultSort = 'name', sortable, wrap = false} = tableData
    const [sort, setSort] = useState(defaultSort)
    const [ascending, setAscending] = useState(!tableData.columns.find(c => c.id === defaultSort)?.descending)

    const overflowStyle = wrap
        ? {whiteSpace: 'inherit'}
        : {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}


    const sortRows = useCallback(({rows, sort, defaultSort, ascending}) => {
        const list = (rows || []).slice()
        const hasValues = list.find(x => x?.[sort] !== undefined && x?.[sort] !== null)
        const type = typeof hasValues?.[sort]

        const isNumber = type === 'number'
        const cmp = (x, y, field, numeric) => {
            const av = x?.[field]
            const bv = y?.[field]
            if (numeric) {
                const an = Number(av ?? 0)
                const bn = Number(bv ?? 0)
                if (an < bn) return -1
                if (an > bn) return 1
                return 0
            }
            const as = (av ?? '').toString()
            const bs = (bv ?? '').toString()
            return as.localeCompare(bs, undefined, {sensitivity: 'base'})
        }
        list.sort((a, b) => {
            // primary compare; flip sign if descending
            const primary = cmp(a, b, sort, isNumber)
            if (primary !== 0) return ascending ? primary : -primary
            // fallback compare is ALWAYS the value from the column data (stable)
            const hasFallback = list.find(x => x?.[defaultSort] !== undefined && x?.[defaultSort] !== null)
            const fallbackType = typeof hasFallback?.[defaultSort] || 'string'
            const fallback = cmp(a, b, defaultSort, fallbackType === 'number')
            return columns?.find(c => c.id === defaultSort)?.descending ? -fallback : fallback
        })
        return list
    }, [columns])

    const effectiveSort = sort || (columns?.find(c => c.id === defaultSort) ? defaultSort : 'name')
    // use the tableData.defaultSort (already pulled into defaultSort) and pass ascending into sortRows
    const sortedRowsFull = sortRows({rows, sort: effectiveSort, defaultSort, ascending})

    const activeRows = sortedRowsFull.filter(x => x[sort] && ![0, '0'].includes(x[sort]))
    const inactiveRows = sortedRowsFull.filter(element => !activeRows.includes(element))
    const finalRows = sort && sort !== defaultSort
        ? [...activeRows, ...inactiveRows]
        : sortedRowsFull

    if (totalsRow) finalRows.push(totalsRow)

    const displayData = {columns: columns, data: finalRows}
    displayData.columns.filter(x => x?.id && x?.align)

    // don't show 'date' column if 'dateString' column exists
    const [hasDateString, setHasDateString] = useState(false)
    tableData.columns.map(
        column => column?.id === 'dateString' && !hasDateString ? setHasDateString(true) : null
    )
    tableData.columns = hasDateString
        ? tableData.columns.filter((column => column.id !== 'date'))
        : tableData.columns

    const handleSort = useCallback((columnId) => {
        if (columnId !== sort) {
            setSort(columnId)
            const defaultAscending = !tableData.columns.find(c => c.id === columnId)?.descending
            setAscending(defaultAscending)
        } else {
            setAscending(!ascending)
        }
    }, [ascending, setAscending, setSort, sort, tableData])

    const sortIcon = ascending
        ? <ArrowDropUpIcon/>
        : <ArrowDropDownIcon/>

    const {width} = useWindowSize()
    const mobile360 = width <= 360
    const mobile395 = width <= 395
    const mobile428 = width <= 428  // but test also at 412
    const window560 = width <= 560
    const window820 = width <= 820

    const fontSize = mobile360 ? '.8rem'
        : mobile395 ? '.85rem'
            : mobile428 ? '.9rem'
                : window560 ? '.95rem'
                    : window820 ? '.95rem'
                        : '.95rem'


    const leftMargins = {left: 14, center: 0, right: 0}
    const rightMargins = {left: 0, center: 0, right: 20}

    return (
        <div style={{width: tableWidth}}>
            <div style={{fontSize: '1.3rem', margin: '10px'}}>{tableData.title}</div>
            <TableContainer id='statsTable'
                            style={{
                                padding: '0px 0px 0px 4px',
                                width: tableWidth,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                height: tableHeight
                            }}
                            component={Paper} elevation={2}>
                <Table size='small' stickyHeader={!!tableHeight} style={{width: tableWidth}}>
                    <TableHead>
                        <TableRow style={{backgroundColor: '#111'}}>
                            {displayData.columns.map((column, index) =>
                                <TableCell key={index + 1}
                                           sx={{
                                               alignContent: 'center',
                                               justifyItems: column.align,
                                               fontSize: fontSize,
                                               lineHeight: '1.1rem',
                                               padding: '6px 2px',
                                               color: '#fff'
                                           }}
                                           component='th' scope='row'>

                                    {sortable && column.id !== 'index' &&
                                        <div style={{display: 'flex', marginLeft: index === 0 ? 10 : 20}}>
                                            <Link onClick={() => handleSort(column.id)}
                                                  style={{
                                                      color: sort === column.id ? '#fff' : '#bbb',
                                                      alignContent: 'center'
                                                  }}>
                                                <nobr>{column.name}</nobr>
                                            </Link>
                                            {sort === column.id
                                                ?
                                                <IconButton onClick={() => handleSort(column.id)} style={{padding: 0}}>
                                                    {sortIcon}</IconButton>
                                                : <div style={{width: 24}}/>
                                            }
                                        </div>
                                        || <div style={{
                                            display: 'flex',
                                            marginLeft: index === 0 ? 10 : 20,
                                            marginRight: 24
                                        }}>
                                            {column.name}
                                        </div>
                                    }
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayData.data.map((row, index) =>
                            <TableRow key={index} index={index}
                                      sx={{
                                          '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
                                          'td, th': {}
                                      }}>
                                {displayData.columns.map((column, idx) =>
                                    column.id !== 'spacer'
                                        ? <TableCell key={idx + 1}
                                                     sx={{
                                                         ...overflowStyle,
                                                         textAlign: column.align,
                                                         fontSize: fontSize,
                                                         padding: '8px 2px',
                                                         border: 0,
                                                         color: '#eee'
                                                     }}
                                                     component='th' scope='row'>

                                            <div style={{
                                                textAlign: column.align,
                                                marginLeft: leftMargins[column.align],
                                                marginRight: rightMargins[column.align],
                                                fontWeight: totalsRow && index === displayData.data.length - 1 ? 700 : 'inherit'
                                            }}>
                                                {linkFunction(column.id, row[column.id] ? (row[column.displayField] || row[column.id]).toLocaleString() : '')}
                                            </div>
                                        </TableCell>
                                        : <TableCell key={index + 1} style={{border: 0}}/>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default DataTableSort
