import {useRef} from 'react'

const DRAG_THRESHOLD_PX = 6

export default function useClickOrDrag({ onClick, onDragStart, onDragMove, onDragEnd }) {
    const stateRef = useRef({
        pointerId: null,
        downX: 0,
        downY: 0,
        dragging: false
    })

    const onPointerDown = e => {
        // only left mouse button (ignore right click)
        if (e.pointerType === 'mouse' && e.button !== 0) return

        e.currentTarget.setPointerCapture(e.pointerId)

        stateRef.current.pointerId = e.pointerId
        stateRef.current.downX = e.clientX
        stateRef.current.downY = e.clientY
        stateRef.current.dragging = false

        onDragStart?.(e)
    }

    const onPointerMove = e => {
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
        if (stateRef.current.pointerId !== e.pointerId) return

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
