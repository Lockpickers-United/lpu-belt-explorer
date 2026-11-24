import React from 'react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {act, cleanup, render, renderHook, screen} from '@testing-library/react'
import Countdown, {useCountdown} from '../../src/util/useCountdown.jsx'

describe('useCountdown', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-11-23T12:00:00Z'))
    })

    afterEach(() => {
        cleanup()
        vi.useRealTimers()
    })

    it('formats the initial remaining time and updates every second', () => {
        const endTime = Date.now() + 3723000
        const {result} = renderHook(() => useCountdown({endTime}))
        expect(result.current.formattedTime).toBe('01:02:03')

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.formattedTime).toBe('01:02:02')
    })

    it('counts down to zero, rounding partial seconds up', () => {
        const endTime = Date.now() + 1500
        const {result} = renderHook(() => useCountdown({endTime}))
        expect(result.current.formattedTime).toBe('00:00:02')
        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.formattedTime).toBe('00:00:01')
        act(() => vi.advanceTimersByTime(2000))
        expect(result.current).toEqual({remaining: 0, formattedTime: '00:00:00'})
    })

    it('supports changed deadlines and hours beyond 24', () => {
        const {result, rerender} = renderHook(({endTime}) => useCountdown({endTime}), {
            initialProps: {endTime: Date.now() + 1000}
        })
        rerender({endTime: Date.now() + 90061000})
        expect(result.current.formattedTime).toBe('25:01:01')
    })

    it.each([undefined, NaN, 0])('returns zero for an invalid or expired deadline: %s', endTime => {
        const {result} = renderHook(() => useCountdown({endTime}))
        expect(result.current.formattedTime).toBe('00:00:00')
    })

    it('clears its interval when unmounted', () => {
        const {unmount} = renderHook(() => useCountdown({endTime: Date.now() + 10000}))
        expect(vi.getTimerCount()).toBe(1)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
    })

    it('passes the deadline to the Countdown component and reports ticks', () => {
        const onTick = vi.fn()
        render(<Countdown endTime={Date.now() + 2000} onTick={onTick}/>)
        expect(screen.getByText('00:00:02')).toBeInTheDocument()
        act(() => vi.advanceTimersByTime(1000))
        expect(screen.getByText('00:00:01')).toBeInTheDocument()
        expect(onTick).toHaveBeenLastCalledWith(1000)
    })
})
