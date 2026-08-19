import React, {useCallback, useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import AppContext from '../../app/AppContext.jsx'
import Switch from '@mui/material/Switch'
import Link from '@mui/material/Link'
import {useLocalStorage} from 'usehooks-ts'

export default function BetaToggleRoute() {
    usePageTitle('Toggle Beta Features')

    const {beta, setBeta} = useContext(AppContext)
    const handleBetaClick = useCallback(() => {
        setBeta(!beta)
    }, [beta, setBeta])

    const [flickrDirect, setFlickrDirect] = useLocalStorage('flickrDirect', false)
    const handleFlickrClick = useCallback(() => {
        setFlickrDirect(!flickrDirect)
    }, [flickrDirect, setFlickrDirect])

    const nav = (
        <React.Fragment></React.Fragment>
    )

    const linkSx = {
        color: '#fff', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            textDecoration: 'underline'
        }
    }

    return (
        <div style={{
            maxWidth: 700, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginBottom: 46
        }}>

            <Nav title='Toggle Beta' extras={nav}/>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700, margin:'90px 0 0'}}>
                <Link onClick={handleBetaClick} sx={linkSx}>Beta Features</Link>
                <Switch label='Beta Mode' checked={beta} onChange={handleBetaClick} color='secondary'/>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700, margin:'10px 0 90px'}}>
                <Link onClick={handleFlickrClick} sx={linkSx}>Images link to flickr</Link>
                <Switch label='Flickr Direct' checked={flickrDirect} onChange={handleFlickrClick} color='secondary'/>
            </div>

            <Footer/>
        </div>
    )
}
