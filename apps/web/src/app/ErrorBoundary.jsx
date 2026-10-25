import React, {useEffect, useState} from 'react'
import {useRouteError} from 'react-router-dom'
import ErrorFallback from './ErrorFallback'

function ErrorBoundary() {
    const err = useRouteError()
    const [reloading] = useState(err.message.includes('Failed to fetch dynamically imported module'))

    useEffect(() => {
        console.error('Error boundary caught error', err)
        if (reloading) {
            location.reload(true)
        }
    }, [err, reloading])

    if (reloading) return null
    return <ErrorFallback/>
}

export default ErrorBoundary
