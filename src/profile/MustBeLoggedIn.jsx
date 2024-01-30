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
            <CardHeader title='Log In!'/>
            <CardContent>
                <Typography variant='h6' align='center'>
                    You must be logged in to edit your profile.
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProfileNotFound
