import {defineConfig, globalIgnores, includeIgnoreFile} from 'eslint/config'
import {fileURLToPath} from 'node:url'

import js from '@eslint/js'
import globals from 'globals'
import importPlugin, {createNodeResolver} from 'eslint-plugin-import-x'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
    globalIgnores([
        '**/*.md',
        '**/*.png',
        '**/*.gif',
        '**/*.csv',
        '**/*.html',
        '**/*.json',
        '**/*.css',
        'src/projects/beltInvestigationsWIP/*'
    ]),
    includeIgnoreFile(gitignorePath),
    {
        settings: {
            'import-x/resolver-next': [
                createNodeResolver({
                    extensions: ['.js', '.jsx', '.json']
                })
            ]
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            ecmaVersion: 'latest',
            sourceType: 'module'
        },

        plugins: {
            'import-x': importPlugin
        },

        rules: {
            ...js.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,

            'no-unused-vars': ['warn', {
                ignoreRestSiblings: true,
                args: 'all',
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_'
            }],

            quotes: ['warn', 'single', {
                avoidEscape: true
            }],

            eqeqeq: ['warn', 'always'],
            semi: ['warn', 'never'],

            'import-x/extensions': [
                'warn',
                'ignorePackages',
                {
                    js: 'always',
                    jsx: 'always',
                    json: 'always'
                }
            ],

            'import-x/no-unresolved': 'off',
            'import-x/namespace': 'off'
        }
    }
])
