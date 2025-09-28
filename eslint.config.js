import {defineConfig, globalIgnores} from 'eslint/config'

import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import _import from 'eslint-plugin-import'

import {fileURLToPath} from 'url'
import {dirname} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import {
    fixupPluginRules,
    fixupConfigRules,
    includeIgnoreFile
} from '@eslint/compat'

import js from '@eslint/js'

import {FlatCompat} from '@eslint/eslintrc'

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([{

    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.json']
            }
        },
        'react': {
            'version': 'detect'
        }
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node
        },

        ecmaVersion: 'latest',
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: ['jsx']
        }
    },

    plugins: {
        react: fixupPluginRules(react),
        'react-hooks': fixupPluginRules(reactHooks),
        import: fixupPluginRules(_import)
    },

    extends: fixupConfigRules(compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/recommended'
    )),

    rules: {
        'react/prop-types': 'off',

        'no-unused-vars': ['warn', {
            'ignoreRestSiblings': true,
            'args': 'all',
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_',
            'destructuredArrayIgnorePattern': '^_',
            'caughtErrors': 'all',
            'caughtErrorsIgnorePattern': '^_'
        }],

        'react-hooks/exhaustive-deps': 'warn',

        'quotes': ['warn', 'single', {
            'avoidEscape': true
        }],

        'eqeqeq': ['warn', 'always'],
        'semi': ['warn', 'never'],

        'import/extensions': [
            'warn',
            'ignorePackages',
            {
                js: 'always',
                jsx: 'always',
                json: 'always'
            }
        ],

        'import/no-unresolved': 'off',
        'import/namespace': 'off'
    }
},
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
        // your overrides
         //files: ["/src/projects/beltInvestigationsWIP/*"]
    },
])
