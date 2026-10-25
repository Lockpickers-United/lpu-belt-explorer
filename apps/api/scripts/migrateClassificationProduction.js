#!/usr/bin/env node

import isDirectRun from '../src/util/isDirectRun.js'
import {runClassificationMigration} from './migrateClassificationDev.js'

export function runProductionClassificationMigration(args, dependencies) {
    const [mode, ...options] = args
    return runClassificationMigration([mode, '--target', 'production', ...options], dependencies)
}

if (isDirectRun(import.meta.url)) {
    runProductionClassificationMigration(process.argv.slice(2))
        .then(result => {
            process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
            if (result.conflicts?.length) process.exitCode = 1
        })
        .catch(error => {
            process.stderr.write(`${error.message}\n`)
            process.exitCode = 1
        })
}
