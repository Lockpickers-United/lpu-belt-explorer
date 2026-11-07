import * as React from 'react'
import {useEffect} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'

export default function ImgurEmbed({imageId}) {

    const {isMobile} = useWindowSize()
    const blockStyle = {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 16,
        display: 'block',
        marginTop: -70,
    }

    useEffect(() => {
        // Check if the script is already loaded; if not, inject it
        if (!document.getElementById('imgur-embed-script')) {
            const script = document.createElement('script')
            script.id = 'imgur-embed-script'
            script.src = '//s.imgur.com/min/embed.js'
            script.async = true
            script.charSet = 'utf-8'
            document.body.appendChild(script)
        }
        if (window.imgurEmbed && typeof window.imgurEmbed.createIframe === 'function') {
            window.imgurEmbed.createIframe()
        }
    }, [imageId])

    return (
        <div style={{width: '100%', height: isMobile ? 330 : 600, display: 'block', overflow: 'hidden'}}>
            <div style={blockStyle}>
                <blockquote className='imgur-embed-pub' lang='en' data-id={`a/${imageId}`}>
                    <a href={`https://imgur.com/a/${imageId}`}>View post on imgur</a>
                </blockquote>
            </div>
        </div>
    )

}
