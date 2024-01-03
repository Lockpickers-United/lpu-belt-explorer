import useWindowSize from '../util/useWindowSize.jsx'

// TODO: combine with useWindowSize
export function useWindowWidths() {
    const {width} = useWindowSize()
    const midWidth = width < 700
    const smallWidth = width < 500
    return (
        [width,midWidth,smallWidth]
    )
}
