import React, {useContext} from 'react'
import querystring from 'query-string'
import AppContext from './AppContext'

function Tracker({feature}) {
    const {admin} = useContext(AppContext)
    if (import.meta.env.DEV || admin) return null
    const randomStuff = (Math.random()).toString(36).substring(2, 10)
    const file = files[feature] || 'lpu.gif'
    const ref = document.referrer || 'none'
    const page = window.location.href.replace(/.*\/#\/(\w+)\?*.*/,'$1')
    const query = querystring.stringify({trk: feature, r: randomStuff, w: screen.width, ref, page})
    const url = `https://images.lpubelts.com/i/${file}?${query}`
    return <img alt='lpu' src={url} width={0} height={0}/>
}

const files = {
    locks: 'welcome.gif',
    lock: 'clear.gif'
}

export default React.memo(Tracker)
