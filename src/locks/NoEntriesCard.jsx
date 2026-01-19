import React, {useCallback, useContext, useDeferredValue} from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import LockListContext from './LockListContext'
import FilterContext from '../context/FilterContext.jsx'

function NoEntriesCard({label, isSearch}) {
    const {tab, setDisplayAll} = useContext(LockListContext)
    const {filterCount, clearFilters} = useContext(FilterContext)
    const defTab = useDeferredValue(tab)
    const style = {
        marginTop: 16,
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0
    }

    const isSearchTab = defTab === 'search'
    const message = isSearchTab && !isSearch && filterCount === 0
        ? 'No search or filter criteria selected.'
        : <span>No matching {label.toLowerCase()} were found.<br/>Try adjusting filters, search, or tab.</span>

    const handleClick = useCallback(() => {
        setTimeout(() => {
            clearFilters()
            setDisplayAll(true)
        }, 50)
    }, [clearFilters, setDisplayAll])

    return (
        <Card style={style}>
            <CardContent style={{paddingBottom: 8}}>
                <Typography variant='h6' align='center'>
                    {message}
                </Typography>
            </CardContent>
            {isSearchTab &&
                <CardActions style={{paddingBottom: 16}}>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={handleClick}
                        style={{minWidth: 160, margin: 'auto'}}
                    >
                        View all locks
                    </Button>
                </CardActions>
            }
        </Card>
    )
}

export default NoEntriesCard
