import {describe, expect, it, vi} from 'vitest'

import {createLoggerWrapper} from './logger.js'

const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']

const createPinoMock = () => {
    const pinoMock = Object.fromEntries(
        logLevels.map((level) => [level, vi.fn()])
    )
    const childMock = Object.fromEntries(
        logLevels.map((level) => [level, vi.fn()])
    )

    childMock.levels = {values: {trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60}}
    childMock.child = vi.fn(() => childMock)
    pinoMock.levels = childMock.levels
    pinoMock.child = vi.fn(() => childMock)

    return pinoMock
}

describe('logger wrapper', () => {
    it('supports simple message logging', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)

        logger.info('simple message')

        expect(pinoMock.info).toHaveBeenCalledWith('simple message')
    })

    it('supports printf-style logging arguments', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)

        logger.info('value: %s', 'example')

        expect(pinoMock.info).toHaveBeenCalledWith('value: %s', 'example')
    })

    it('supports structured logging with a message', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)

        logger.info({value: 'example'}, 'structured message')

        expect(pinoMock.info).toHaveBeenCalledWith({value: 'example'}, 'structured message')
    })

    it('supports structured error logging with a message', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)
        const err = new Error('test error')

        logger.error({err}, 'error message')

        expect(pinoMock.error).toHaveBeenCalledWith({err}, 'error message')
    })

    it('exposes the expected log levels', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)

        for (const level of logLevels) {
            logger[level](`${level} message`)
            expect(pinoMock[level]).toHaveBeenCalledWith(`${level} message`)
        }
    })

    it('exposes levels from the underlying logger', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)

        expect(logger.levels.values.info).toBe(30)
    })

    it('supports child loggers', () => {
        const pinoMock = createPinoMock()
        const logger = createLoggerWrapper(pinoMock)
        const child = logger.child({module: 'test'})

        child.info('child message')

        expect(pinoMock.child).toHaveBeenCalledWith({module: 'test'}, undefined)
        expect(pinoMock.child.mock.results[0].value.info).toHaveBeenCalledWith('child message')
    })
})
