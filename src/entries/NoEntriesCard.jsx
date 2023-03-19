import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import {useContext} from 'react'
import AppContext from '../contexts/AppContext.jsx'
import {useDeferredValue} from 'react'
import Button from '@mui/material/Button'

function NoEntriesCard({onDisplayAll}) {
    const {tab} = useContext(AppContext)
    const defTab = useDeferredValue(tab)
    const style = {marginTop: 16, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const isSearchTab = defTab === 'search'
    const message = isSearchTab
        ? 'No search or filter criteria selected.'
        : <span>No matching locks were found.<br/>Try adjusting filters, search, or tab.</span>

    return (
        <Card style={style}>
            <CardContent style={{paddingBottom: 8}}>
                <Typography variant='h6' align='center'>
                    {message}
                </Typography>
            </CardContent>
            {isSearchTab &&
                <CardActions style={{paddingBottom: 16}}>
                    <Button variant='outlined' color='inherit' onClick={onDisplayAll} style={{minWidth: 160, margin: 'auto'}}>
                        View all locks
                    </Button>
                </CardActions>
            }
        </Card>
    )
}

export default NoEntriesCard
