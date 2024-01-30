import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

function ProfileNotFound() {
    const style = {
        marginTop: 16,
        maxWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0
    }

    return (
        <Card style={style}>
            <CardHeader title='Profile Not Found!'/>
            <CardContent>
                <Typography variant='h6' align='center'>
                    This profile was not found, or is not public.
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProfileNotFound
