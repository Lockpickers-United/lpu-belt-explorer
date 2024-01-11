import React, {useEffect} from 'react'
import {useRouteError} from 'react-router-dom'
import ErrorFallback from './ErrorFallback'

function ErrorBoundary() {
    const err = useRouteError()

    useEffect(() => {
        console.error('Error boundary caught error', err)
    }, [err])

    return <ErrorFallback/>
}

export default ErrorBoundary
