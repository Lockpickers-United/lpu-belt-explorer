import React, {useCallback, useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import AppContext from '../../app/AppContext.jsx'
import Switch from '@mui/material/Switch'
import Link from '@mui/material/Link'

export default function BetaToggleRoute() {
    usePageTitle('Toggle Beta Features')

    const {beta, setBeta} = useContext(AppContext)
    const handleClick = useCallback(() => {
        setBeta(!beta)
    }, [beta, setBeta])

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

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700, margin:'90px 0'}}>
                <Link onClick={handleClick} sx={linkSx}>Beta Features</Link>
                <Switch label='Beta Mode' checked={beta} onChange={handleClick} color='secondary'/>
            </div>

            <Footer/>
        </div>
    )
}
