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

function NoProfileData() {
    const {user} = useContext(AuthContext)
    const {userId} = useParams()
    const navigate = useNavigate()

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {marginTop: -32, maxWidth: 700, marginLeft: 8, marginRight: 8,borderRadius: 0}
        : {marginTop: -32, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const isCurrentUser = userId === user?.uid
    const message = isCurrentUser
        ? <React.Fragment>
            <span>
                There are no locks in your collection.
                <br/>
                Browse the site and use the &quot;My Collection&quot; button to track
                locks that you own, picked, recorded, or wish to buy.
                <br/>
            </span>
            <img alt='My Collection' src={mycollectionImagePath}/>
        </React.Fragment>
        : 'There are no locks in this collection.'
    const buttonText = isCurrentUser ? 'Explore' : 'Go Home'

    const handleClick = useCallback(() => {
        navigate('/locks')
    }, [navigate])

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
                        style={{whiteSpace: 'nowrap'}}
                    >{buttonText}</Button>
                </CardActions>
            </Card>
        </Box>
    )
}

export default NoProfileData
