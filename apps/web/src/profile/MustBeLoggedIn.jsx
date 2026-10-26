import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SignInButton from '../auth/SignInButton.jsx'

export default function MustBeLoggedIn({actionText = 'edit your profile'}) {
    const style = {
        marginTop: 16,
        maxWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0
    }

    return (
        <Card style={style}>
            <CardHeader title='Please Log In'/>
            <CardContent>
                <Typography variant='h6' align='center'>
                    You must be logged in to<br/>
                    {actionText}.
                </Typography>
                <div style={{marginLeft:120, marginTop:30}}><SignInButton/></div>
            </CardContent>
        </Card>
    )
}
