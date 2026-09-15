import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import-x'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

const applicationFiles = [
    'src/**/*.{js,jsx}',
    'scripts/**/*.{js,cjs,mjs,jsx}',
]

export default [
    {
        ignores: [
            '**/*.md',
            '**/*.png',
            '**/*.gif',
            '**/*.csv',
            '**/*.html',
            '**/*.json',
            '**/*.css',
        ],
    },
    {
        files: applicationFiles,
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: false,
        },
        plugins: {
            'import-x': importPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            'no-constant-binary-expression': 'off',
            'no-useless-assignment': 'off',
            'preserve-caught-error': 'off',
            'no-unused-vars': ['warn', {
                ignoreRestSiblings: true,
                args: 'all',
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^(React|_)',
                destructuredArrayIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
            }],
            'react-hooks/exhaustive-deps': 'warn',
            quotes: ['warn', 'single', {avoidEscape: true}],
            eqeqeq: ['warn', 'always'],
            semi: ['warn', 'never'],
            'import-x/extensions': ['warn', 'never', {
                ignorePackages: true,
                pattern: {
                    jsx: 'never',
                    json: 'always',
                },
            }],
            'import-x/no-unresolved': 'off',
            'import-x/namespace': 'off',
        },
    },
    {
        files: ['scripts/**/*.{js,cjs,mjs,jsx}'],
        rules: {
            'import-x/extensions': ['warn', 'never', {
                ignorePackages: true,
                pattern: {
                    js: 'always',
                    jsx: 'never',
                    json: 'always',
                },
            }],
        },
    },
]
