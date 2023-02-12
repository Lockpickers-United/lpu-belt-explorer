module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    plugins: [
        'react',
        'react-hooks'
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
        ],
        'react-hooks/exhaustive-deps': 'warn'
    },
    ignorePatterns: [
        '*.md',
        '*.png',
        '*.csv'
    ]
}
