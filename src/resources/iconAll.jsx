import * as React from 'react'

const SvgComponent = (props) => {
    return (
        <div style={{position: 'relative', minWidth: 32, height: 32}}>
            <div style={{
                display: 'inline-block',
                minWidth: 32,
                height: 32,
                position: 'absolute',
                top: 0,
                left: 0,
                paddingTop: 2
            }}>

                <svg id='Layer_1' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 32 32'>
                    <rect fill={props.fill} x="2" y="6.2" width="28" height="19.1" rx="2" ry="2"/>
                    <g>
                        <path fill='#2A2A2A'
                              d="M8.4,17.4l-.6,2.2h-2l2.5-8.9h2.5l2.5,8.9h-2l-.6-2.2h-2.3ZM10.4,15.9l-.5-1.9c-.1-.5-.3-1.3-.4-1.8h0c-.1.5-.3,1.3-.4,1.8l-.5,1.9h1.8Z"/>
                        <path fill='#2A2A2A' d="M14.9,10.7h1.9v7.3h3.2v1.6h-5.1v-8.9Z"/>
                        <path fill='#2A2A2A' d="M21.7,10.7h1.9v7.3h3.2v1.6h-5.1v-8.9Z"/>
                    </g>

                </svg>
            </div>
        </div>
    )
}
export default SvgComponent
