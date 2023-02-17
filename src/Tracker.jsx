import React, {useId} from 'react'

function Tracker({entry}) {
    const randomStuff = useId()
    const file = entry ? 'clear.gif' : 'welcome.gif'
    const suffix = entry ? `id=${entry.id}&r=${randomStuff}` : `r=${randomStuff}`
    const url = `https://images.lpubelts.com/i/${file}?${suffix}`
    return <img src={url} width={0} height={0}/>
}

export default Tracker
