const fatalEvents = ['uncaughtException', 'unhandledRejection']
const shutdownSignals = ['SIGTERM', 'SIGINT']

function normalizeError(value) {
    if (value instanceof Error) return value
    return new Error(typeof value === 'string' ? value : String(value))
}

function fallbackLog(level, message, error) {
    const values = error ? [message, error] : [message]
    if (level === 'fatal' || level === 'error') console.error(...values)
    else console.log(...values)
}

export function installProcessLifecycleHandlers({
    server,
    readiness,
    logger,
    drainTimeoutMs = 10_000,
    processTarget = process,
    exit = code => processTarget.exit(code),
    setTimer = setTimeout,
    clearTimer = clearTimeout
}) {
    let shutdownStarted = false
    let shutdownFinished = false
    let drainTimer

    function log(level, context, message) {
        try {
            logger[level](context, message)
        } catch {
            fallbackLog(level, message, context?.err)
        }
    }

    function finish(exitCode) {
        if (shutdownFinished) return
        shutdownFinished = true
        if (drainTimer) clearTimer(drainTimer)
        exit(exitCode)
    }

    function shutdown({reason, exitCode, error}) {
        if (shutdownStarted) return
        shutdownStarted = true
        try {
            readiness.markNotReady(reason)
        } catch (readinessError) {
            log('error', {err: readinessError, reason}, 'unable to update readiness')
        }

        if (error) {
            log('fatal', {err: normalizeError(error), reason}, 'fatal process error')
        } else {
            log('info', {reason}, 'server shutdown started')
        }

        drainTimer = setTimer(() => {
            log('error', {reason, drainTimeoutMs}, 'server drain timed out')
            finish(exitCode)
        }, drainTimeoutMs)

        try {
            if (!server.listening) {
                finish(exitCode)
                return
            }
            server.close(closeError => {
                if (closeError) {
                    log('error', {err: closeError, reason}, 'server shutdown error')
                    finish(1)
                    return
                }
                finish(exitCode)
            })
            if (typeof server.closeIdleConnections === 'function') {
                server.closeIdleConnections()
            }
        } catch (closeError) {
            log('error', {err: closeError, reason}, 'server shutdown error')
            finish(1)
        }
    }

    const handlers = {
        uncaughtException: error => shutdown({
            reason: 'uncaught_exception',
            exitCode: 1,
            error
        }),
        unhandledRejection: reason => shutdown({
            reason: 'unhandled_rejection',
            exitCode: 1,
            error: reason
        }),
        serverError: error => shutdown({
            reason: 'server_error',
            exitCode: 1,
            error
        }),
        SIGTERM: () => shutdown({reason: 'sigterm', exitCode: 0}),
        SIGINT: () => shutdown({reason: 'sigint', exitCode: 0})
    }

    fatalEvents.forEach(event => processTarget.once(event, handlers[event]))
    shutdownSignals.forEach(signal => processTarget.once(signal, handlers[signal]))
    server.once('error', handlers.serverError)

    return Object.freeze({
        shutdown,
        removeHandlers() {
            fatalEvents.forEach(event => processTarget.off(event, handlers[event]))
            shutdownSignals.forEach(signal => processTarget.off(signal, handlers[signal]))
            server.off('error', handlers.serverError)
        }
    })
}
