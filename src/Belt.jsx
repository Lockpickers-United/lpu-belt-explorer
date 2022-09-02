import React from 'react'

function Belt({value}) {
    const color = value.toLowerCase()
    const backgroundColor = colors[color]
    const style = {
        width: 8,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor
    }
    return <div style={style}/>
}

export default Belt

const colors = {
    white: '#ffffff',
    yellow: '#fffb3a',
    orange: '#df651e',
    green: '#28ba28',
    blue: '#0019f8',
    purple: '#6810cf',
    brown: '#7d5016',
    red: '#fe1016',
    black: '#000000'
}
