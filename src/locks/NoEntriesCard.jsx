import React, {useCallback, useContext, useDeferredValue} from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import LockListContext from './LockListContext'

function NoEntriesCard({label}) {
    const {tab, setDisplayAll} = useContext(LockListContext)
    const defTab = useDeferredValue(tab)
    const style = {
        marginTop: 16,
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0
    }

    const isSearchTab = defTab === 'search'
    const message = isSearchTab
        ? 'No search or filter criteria selected.'
        : <span>No matching {label} were found.<br/>Try adjusting filters, search, or tab.</span>

    const handleClick = useCallback(() => {
        setTimeout(() => setDisplayAll(true), 50)
    }, [setDisplayAll])

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
