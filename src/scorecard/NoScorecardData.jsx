import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import React, {useCallback, useContext} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import mycollectionImagePath from '../resources/mycollection.png'
import useWindowSize from '../util/useWindowSize'

function NoProfileData({collectionType}) {

    const {user} = useContext(AuthContext)
    const {userId} = useParams()
    const navigate = useNavigate()

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {marginTop: 20, maxWidth: 700, marginLeft: 8, marginRight: 8, borderRadius: 0}
        : {marginTop: 20, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const isCurrentUser = userId === user?.uid
    const message = isCurrentUser
        ? <div style={{width:'100%', display:'flex', placeItems:'center'}}>
            <div style={{fontSize: '1.0rem', fontWeight: 400, width: 400, marginLeft: 'auto', marginRight: 'auto'}}>
                <strong>There are no locks in your Scorecard.</strong>
                <br/>
                Browse the site and use the &quot;My Collection&quot; button to track
                locks that you have picked and recorded.
                <br/><br/>
                <img alt='My Collection' src={mycollectionImagePath}/>
            </div>
        </div>
        : 'There are no locks in this collection.'

    const buttonText = !isCurrentUser
        ? 'Go Home'
        : collectionType === 'safelocks'
            ? 'Explore Safe Locks'
            : 'Explore Locks'

    const handleClick = useCallback(() => {
        if (collectionType === 'safelocks') {
            navigate('/safelocks')
        } else {
            navigate('/locks')
        }
    }, [navigate, collectionType])

    return (
        <Box alignContent='center'>
            <Card style={style}>
                <CardContent>
                    <Typography variant='h6' align='center'>
                        {message}
                    </Typography>
                </CardContent>
                <CardActions>
                    <div style={{width: '100%'}}/>
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={handleClick}
                        style={{whiteSpace: 'nowrap', padding:'10px 30px', margin:10}}
                    >{buttonText}</Button>
                </CardActions>
            </Card>
        </Box>
    )
}

export default NoProfileData
