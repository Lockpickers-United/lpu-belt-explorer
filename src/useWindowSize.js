import {useEffect, useState} from 'react'

export default function useWindowSize() {
    const [dimensions, setDimensions] = useState(window.innerHeight)

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return dimensions
}
