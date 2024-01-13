import {useEffect, useMemo, useState} from 'react'
import debounce from 'debounce'

export default function useWindowSize() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    useEffect(() => {
        const handleResize = debounce(() => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }, 100)

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return useMemo(() => ({
        ...dimensions,
        isMobile: dimensions.width < 650
    }), [dimensions])
}
