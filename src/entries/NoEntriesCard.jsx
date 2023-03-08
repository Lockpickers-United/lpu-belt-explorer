import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

function NoEntriesCard() {
    const style = {marginTop: 16, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    return (
        <Card style={style}>
            <CardContent style={{paddingBottom: 16}}>
                <Typography variant='h6' align='center'>
                    No matching locks were found.
                </Typography>
            </CardContent>
        </Card>
    )
}

export default NoEntriesCard
