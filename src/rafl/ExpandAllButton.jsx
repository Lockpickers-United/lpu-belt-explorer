import React, {useCallback, useContext} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import FilterContext from '../context/FilterContext.jsx'

function ExpandAllButton() {
    const {filters, addFilter, removeFilter} = useContext(FilterContext)
    const {expandAll} = filters
    console.log('filters', filters)

    const handleClick = useCallback(() => {
        if (!expandAll || expandAll === 'false') {
            addFilter('expandAll', 'Expand All', true)
        } else {
            removeFilter('expandAll', 'Expand All')
        }
    }, [expandAll, addFilter, removeFilter])


    const toolTip = !expandAll ? 'Expand All' : 'Collapse All'

    return (
        <div>

            <Tooltip title={toolTip} arrow disableFocusListener>
                <Button onClick={() => handleClick()} style={{color: '#ddd'}} size='small'>
                    {toolTip}
                </Button>
            </Tooltip>
        </div>
    )
}

export default ExpandAllButton
