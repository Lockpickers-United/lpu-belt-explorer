import {useMemo} from 'react'
import {useWindowSize} from 'usehooks-ts'

export default function useWindowSize2() {
    const {width, height} = useWindowSize()

    return useMemo(() => ({
        width,
        height,
        isMobile: width < 650
    }), [width, height])
}
