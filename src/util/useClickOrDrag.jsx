import {useRef} from 'react'

const DRAG_THRESHOLD_PX = 6

const getPinchData = pointers => {
    const [firstPointer, secondPointer] = [...pointers.values()]
    const dx = secondPointer.clientX - firstPointer.clientX
    const dy = secondPointer.clientY - firstPointer.clientY

    return {
        centerX: (firstPointer.clientX + secondPointer.clientX) / 2,
        centerY: (firstPointer.clientY + secondPointer.clientY) / 2,
        distance: Math.hypot(dx, dy)
    }
}

export default function useClickOrDrag({
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd,
    onPinchStart,
    onPinchMove,
    onPinchEnd
}) {
    const stateRef = useRef({
        pointerId: null,
        downX: 0,
        downY: 0,
        dragging: false,
        pinching: false,
        suppressClick: false,
        pointers: new Map()
    })

    const onPointerDown = e => {
        // only left mouse button (ignore right click)
        if (e.pointerType === 'mouse' && e.button !== 0) return

        e.currentTarget.setPointerCapture(e.pointerId)

        stateRef.current.pointers.set(e.pointerId, {
            clientX: e.clientX,
            clientY: e.clientY
        })

        if (stateRef.current.pointers.size === 2) {
            stateRef.current.pointerId = null
            stateRef.current.dragging = false
            stateRef.current.pinching = true
            stateRef.current.suppressClick = true

            onDragEnd?.(e, {wasDragging: true})
            onPinchStart?.(e, getPinchData(stateRef.current.pointers))
            return
        }

        if (stateRef.current.pointers.size > 1 || stateRef.current.suppressClick) {
            stateRef.current.suppressClick = true
            return
        }

        stateRef.current.pointerId = e.pointerId
        stateRef.current.downX = e.clientX
        stateRef.current.downY = e.clientY
        stateRef.current.dragging = false

        onDragStart?.(e)
    }

    const onPointerMove = e => {
        if (!stateRef.current.pointers.has(e.pointerId)) return

        stateRef.current.pointers.set(e.pointerId, {
            clientX: e.clientX,
            clientY: e.clientY
        })

        if (stateRef.current.pinching) {
            if (stateRef.current.pointers.size >= 2) {
                onPinchMove?.(e, getPinchData(stateRef.current.pointers))
            }
            return
        }

        if (stateRef.current.pointerId !== e.pointerId) return

        const dx = e.clientX - stateRef.current.downX
        const dy = e.clientY - stateRef.current.downY
        const dist = Math.hypot(dx, dy)

        if (!stateRef.current.dragging && dist >= DRAG_THRESHOLD_PX) {
            stateRef.current.dragging = true
        }

        if (stateRef.current.dragging) {
            onDragMove?.(e, { dx, dy })
        }
    }

    const finish = e => {
        if (!stateRef.current.pointers.has(e.pointerId)) return

        const wasPinching = stateRef.current.pinching
        const wasSuppressingClick = stateRef.current.suppressClick
        const isTrackedPointer = stateRef.current.pointerId === e.pointerId

        stateRef.current.pointers.delete(e.pointerId)

        if (wasPinching) {
            if (stateRef.current.pointers.size < 2) {
                stateRef.current.pinching = false
                stateRef.current.dragging = false
                stateRef.current.pointerId = null
                onPinchEnd?.(e)
            }

            if (stateRef.current.pointers.size === 0) {
                stateRef.current.suppressClick = false
            }

            return
        }

        if (wasSuppressingClick) {
            if (stateRef.current.pointers.size === 0) {
                stateRef.current.suppressClick = false
            }

            return
        }

        if (!isTrackedPointer) return

        const wasDragging = stateRef.current.dragging

        stateRef.current.pointerId = null
        stateRef.current.dragging = false

        onDragEnd?.(e, { wasDragging })

        // If it never exceeded threshold, treat as click
        if (!wasDragging) onClick?.(e)
    }

    const onPointerUp = finish
    const onPointerCancel = finish
    const onLostPointerCapture = finish

    return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture }
}
