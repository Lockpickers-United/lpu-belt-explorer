import {useMemo} from 'react'

export default function useWindowSize() {
    let width = undefined,
        timeout = false,
        delay = 250
    function getDimensions() {
        width = window.innerWidth
    }
    window.addEventListener('resize', function() {
        clearTimeout(timeout)
        timeout = setTimeout(getDimensions, delay)
    })

    getDimensions()

    return useMemo(() => ({
        width,
        isMobile: width < 650,
        flexStyle: width < 650 ? 'block' : 'flex'
    }), [width])
}