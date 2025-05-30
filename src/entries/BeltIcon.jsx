import React from 'react'
import belts from '../data/belts'

function BeltIcon({value, style, related, disabled, containerStyle={}}) {
    const rank = parseInt(value.slice(-1)) > 1 ? parseInt(value.slice(-1)) : ''
    const {color, lineColor = '#010101'} = belts[value]
    if (value === 'Unranked') return null
    const rankColor = !disabled ? '#fff' : '#bbb'
    return (
        <div style={{position: 'relative', minWidth: 32, height: 32, ...containerStyle }}>
            <div style={{display: 'inline-block', minWidth: 32, height: 32, ...style,position: 'absolute', top: 0, left: 1}}>
                <svg x='0' y='0' viewBox='0 -2 32 32'>
                    <path
                        d='M10.91 25.6c-.23 0-.46-.06-.65-.18l-4.47-2.73c-.6-.37-.79-1.15-.43-1.74l7.02-11.51c.23-.37.64-.6 1.08-.6.23 0 .46.06.65.18l4.48 2.73c.29.18.49.45.57.78s.03.67-.15.95l-7.02 11.51c-.23.38-.64.61-1.08.61z'
                        fill={color}
                    />
                    <path
                        d='M13.46 9.4c.12 0 .25.03.36.1l4.47 2.73c.33.2.43.63.23.96L11.5 24.7a.704.704 0 0 1-.96.23L6.07 22.2a.698.698 0 0 1-.23-.96l7.02-11.51a.73.73 0 0 1 .6-.33m0-1.13c-.63 0-1.23.33-1.56.87L4.88 20.65c-.25.42-.33.91-.22 1.38.11.47.41.88.82 1.13l4.47 2.73c.29.17.61.27.95.27.63 0 1.23-.33 1.56-.87l7.02-11.51c.25-.42.33-.91.22-1.38-.11-.47-.41-.88-.82-1.13l-4.47-2.73a1.75 1.75 0 0 0-.95-.27z'
                        fill={lineColor}
                    />
                    <path
                        d='M17.57 22.37c-.48 0-.91-.26-1.12-.69L10.33 9.66c-.15-.3-.18-.64-.07-.96.1-.32.33-.58.63-.73l4.86-2.47a1.257 1.257 0 0 1 1.7.55l6.12 12.02c.31.62.07 1.38-.55 1.7l-4.86 2.47c-.19.08-.39.13-.59.13z'
                        fill={color}
                    />
                    <path
                        d='M16.31 5.92c.25 0 .5.14.62.38l6.12 12.02c.17.34.04.76-.3.94l-4.86 2.47c-.1.05-.21.08-.31.08-.25 0-.5-.14-.62-.38L10.84 9.41a.707.707 0 0 1 .3-.94L16 6c.1-.05.21-.08.31-.08m0-1.13c-.29 0-.57.07-.83.2l-4.86 2.47c-.43.22-.76.6-.91 1.06-.14.47-.1.96.12 1.4l6.12 12.02c.31.62.94 1 1.63 1 .29 0 .57-.07.83-.2l4.86-2.47a1.815 1.815 0 0 0 .8-2.45L17.94 5.79c-.31-.62-.94-1-1.63-1z'
                        fill={lineColor}
                    />
                    <path
                        d='M2.57 13.38c-.7 0-1.26-.57-1.26-1.26V6.64c0-.69.57-1.26 1.26-1.26h26.92c.7 0 1.26.57 1.26 1.26v5.48c0 .69-.57 1.26-1.26 1.26H2.57z'
                        fill={color}
                    />
                    <path
                        d='M29.49 5.95c.38 0 .7.31.7.7v5.47c0 .38-.31.7-.7.7H2.57c-.38 0-.7-.31-.7-.7V6.64c0-.38.31-.7.7-.7h26.92m0-1.12H2.57c-1.01 0-1.83.82-1.83 1.83v5.47c0 1.01.82 1.83 1.83 1.83h26.92c1.01 0 1.83-.82 1.83-1.83V6.64c-.01-1-.83-1.82-1.83-1.82z'
                        fill={lineColor}
                    />
                    <path
                        d='M10.35 14.36c-.69 0-1.26-.57-1.26-1.26V5.43c0-.7.57-1.26 1.26-1.26H21.6c.7 0 1.26.57 1.26 1.26v7.67c0 .7-.57 1.26-1.26 1.26H10.35z'
                        fill={color}
                    />
                    <path
                        d='M21.59 4.73c.38 0 .7.31.7.7v7.67c0 .38-.31.7-.7.7H10.35c-.38 0-.7-.31-.7-.7V5.43c0-.38.31-.7.7-.7h11.24m0-1.13H10.35c-1.01 0-1.83.82-1.83 1.83v7.67c0 1.01.82 1.83 1.83 1.83H21.6c1.01 0 1.83-.82 1.83-1.83V5.43a1.846 1.846 0 0 0-1.84-1.83z'
                        fill={lineColor}
                    />
                </svg>
            </div>
            {related &&
            <div style={{position: 'absolute', top: 6, left: 14.5, fontSize: '0.58rem', color:rankColor}}>{rank}</div>
            }
        </div>
    )
}

export default BeltIcon
