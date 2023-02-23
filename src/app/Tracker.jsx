import React from 'react'

function Tracker({id}) {
    if (import.meta.env.DEV) return null
    const randomStuff = (Math.random()).toString(36).substring(2, 10)
    const file = id ? 'clear.gif' : 'welcome.gif'
    const suffix = id ? `id=${id}&r=${randomStuff}` : `r=${randomStuff}`
    const url = `https://images.lpubelts.com/i/${file}?${suffix}`
    return <img src={url} width={0} height={0}/>
}

export default React.memo(Tracker)
