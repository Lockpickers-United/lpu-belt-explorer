import * as React from 'react'
const SvgComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0-2C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0Z" fill="#fff" />
        <path d="M13.3 3v4h-2.7V3zM13.3 17v4h-2.7v-4zM21 13.3h-4v-2.7h4zM7 13.3H3v-2.7h4z" fill="#fff" />
        <circle cx={12} cy={12} r={3.5} fill="#fff" />
    </svg>
)
export default SvgComponent
