import React, {useCallback, useContext} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import FilterContext from '../context/FilterContext.jsx'
import Link from '@mui/material/Link'

function ExpandAllButton({text}) {
    const {filters, addFilter, removeFilter} = useContext(FilterContext)
    const {expandAll} = filters

    const handleClick = useCallback(() => {
        if (!expandAll || expandAll === 'false') {
            addFilter('expandAll', 'Expand All', true)
        } else {
            removeFilter('expandAll', 'Expand All')
        }
    }, [expandAll, addFilter, removeFilter])

    const toolTip = !expandAll ? 'Expand All' : 'Collapse All'

    return !text
        ? (
            <div>
                <Tooltip title={toolTip} arrow disableFocusListener>
                    <Button onClick={() => handleClick()} style={{color: '#aaa'}} size='small'>
                        {toolTip}
                    </Button>
                </Tooltip>
            </div>
        )
        : (
            <div>
                <Tooltip title={toolTip} arrow disableFocusListener>
                    <Link onClick={() => handleClick()}
                          style={{color: '#fff', textDecoration: 'none', cursor: 'pointer'}} size='small'>
                        <div style={{marginLeft: 5, marginTop: 5, padding: 5, fontWeight: 700}}>
                            {toolTip.toUpperCase()}
                        </div>
                    </Link>
                </Tooltip>
            </div>
        )
}

export default ExpandAllButton
