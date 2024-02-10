import React from 'react'
import querystring from 'query-string'
import useWindowSize from '../util/useWindowSize'

function Tracker({feature, ...extraParams}) {
    if (import.meta.env.DEV) return null
    const randomStuff = (Math.random()).toString(36).substring(2, 10)
    const file = files[feature] || 'lpu.gif'
    const ref = document.referrer || 'none'
    const {width} = useWindowSize()
    const query = querystring.stringify({trk: feature, r: randomStuff, w: width, ref, ...extraParams})
    const url = `https://images.lpubelts.com/i/${file}?${query}`
    return <img alt='' src={url} width={0} height={0}/>
}

const files = {
    locks: 'welcome.gif',
    lock: 'clear.gif'
}

export default React.memo(Tracker)
