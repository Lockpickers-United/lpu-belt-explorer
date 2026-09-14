const loopbackHosts = new Set(['127.0.0.1', '::1', 'localhost'])

const isRelativeUrl = value => value.startsWith('/') && !value.startsWith('//')

const isLoopbackUrl = value => {
    try {
        return loopbackHosts.has(new URL(value).hostname)
    } catch (_error) {
        return false
    }
}

export const assertSafeTestEnvironment = environment => {
    if (environment.MODE !== 'test') {
        throw new Error('Tests must run in Vite test mode.')
    }

    const requiredValues = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_AUTH_EMULATOR_HOST',
        'VITE_AUTH_EMULATOR_PORT',
        'VITE_FIRESTORE_EMULATOR_HOST',
        'VITE_FIRESTORE_EMULATOR_PORT',
        'VITE_DATA_BASE_URL',
        'VITE_LOCKBAZAAR_DATA_URL',
        'VITE_NODE_SERVER_URL',
        'VITE_API_SERVER_URL'
    ]
    const missingValues = requiredValues.filter(name => !environment[name])

    if (missingValues.length > 0) {
        throw new Error(`Missing safe test configuration: ${missingValues.join(', ')}`)
    }

    if (environment.VITE_FIREBASE_API_KEY !== 'test-only-api-key') {
        throw new Error('Test mode must use the synthetic Firebase API key.')
    }

    if (!environment.VITE_FIREBASE_PROJECT_ID.startsWith('demo-')) {
        throw new Error('Test mode must use a non-deployable demo Firebase project ID.')
    }

    if (environment.VITE_USE_FIREBASE_EMULATORS !== 'true') {
        throw new Error('Test mode requires Firebase emulators.')
    }

    const emulatorHosts = [
        environment.VITE_AUTH_EMULATOR_HOST,
        environment.VITE_FIRESTORE_EMULATOR_HOST
    ]

    if (emulatorHosts.some(host => !loopbackHosts.has(host))) {
        throw new Error('Firebase test emulators must use loopback hosts.')
    }

    const serviceUrls = [
        environment.VITE_DATA_BASE_URL,
        environment.VITE_LOCKBAZAAR_DATA_URL,
        environment.VITE_NODE_SERVER_URL,
        environment.VITE_API_SERVER_URL
    ]

    if (serviceUrls.some(value => !isRelativeUrl(value) && !isLoopbackUrl(value))) {
        throw new Error('Test data and API URLs must be relative or use a loopback host.')
    }
}
