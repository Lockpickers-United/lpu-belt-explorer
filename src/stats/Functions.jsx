import useWindowSize from '../util/useWindowSize.jsx'

export function cl(obj) {
    console.log(obj)
}

export function windowWidths() {
    const {width} = useWindowSize()
    const midWidth = width < 700
    const smallWidth = width < 500
    return (
        [width,midWidth,smallWidth]
    )
}
