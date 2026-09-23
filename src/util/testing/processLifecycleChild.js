import {EventEmitter} from 'node:events'
import {installProcessLifecycleHandlers} from '../processLifecycle.js'

const scenario = process.argv[2]

function emit(event) {
    process.stdout.write(`${JSON.stringify(event)}\n`)
}

const logger = {
    fatal(context, message) {
        emit({level: 'fatal', message, reason: context.reason})
    },
    error(context, message) {
        emit({level: 'error', message, reason: context.reason})
    },
    info(context, message) {
        emit({level: 'info', message, reason: context.reason})
    }
}

const readiness = {
    markNotReady(reason) {
        emit({event: 'not-ready', reason})
    }
}

class TestServer extends EventEmitter {
    listening = true

    close(callback) {
        emit({event: 'server-close'})
        this.listening = false
        if (scenario !== 'uncaughtException') setImmediate(callback)
    }

    closeIdleConnections() {
        emit({event: 'close-idle-connections'})
    }
}

const server = new TestServer()

installProcessLifecycleHandlers({
    server,
    readiness,
    logger,
    drainTimeoutMs: 50
})

if (scenario === 'uncaughtException') {
    setImmediate(() => {
        throw new Error('child uncaught exception')
    })
} else if (scenario === 'unhandledRejection') {
    setImmediate(() => Promise.reject(new Error('child unhandled rejection')))
} else if (scenario === 'serverError') {
    setImmediate(() => server.emit('error', new Error('child listener error')))
} else {
    process.exit(2)
}
