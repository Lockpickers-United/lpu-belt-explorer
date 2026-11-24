import React, {useEffect, useMemo, useState} from 'react'

export function useCountdown({endTime}) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const remaining = useMemo(() => {
        return Number.isFinite(endTime) ? Math.max(0, endTime - now) : 0
    }, [endTime, now])

    const formattedTime = useMemo(() => {
        const totalSeconds = Math.ceil(remaining / 1000)
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':')
    }, [remaining])

    return {
        remaining,
        formattedTime,
    }
}

export default function Countdown({endTime, onTick}) {
    const watch = useCountdown({endTime})
    useEffect(() => {
        if (onTick) onTick(watch.remaining)
    }, [watch.remaining, onTick])
    return (
        <span>{watch.formattedTime}</span>
    )
}
