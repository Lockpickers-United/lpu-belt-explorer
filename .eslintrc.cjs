module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    plugins: [
        'react'
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: [
            'jsx'
        ],
        sourceType: 'module'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        'react/prop-types': 'off',
        'no-unused-vars': [
            'warn', {
                'ignoreRestSiblings': true
            }
        ]
    },
    ignorePatterns: [
        '*.md',
        '*.png',
        '*.csv'
    ]
}
