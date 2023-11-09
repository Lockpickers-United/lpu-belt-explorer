import React from 'react'
import querystring from 'query-string'

function Tracker({id}) {
    if (import.meta.env.DEV) return null
    const randomStuff = (Math.random()).toString(36).substring(2, 10)
    const file = id ? 'clear.gif' : 'welcome.gif'
    const ref = document.referrer || 'none'
    const query = querystring.stringify({id, r: randomStuff, ref})
    const url = `https://images.lpubelts.com/i/${file}?${query}`
    return <img alt='' src={url} width={0} height={0}/>
}

export default React.memo(Tracker)
