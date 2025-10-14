module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    plugins: [
        'react',
        'react-hooks',
        'import'
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/recommended'
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
                'ignoreRestSiblings': true,
                'args': 'all',
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'destructuredArrayIgnorePattern': '^_',
                'caughtErrors': 'all',
                'caughtErrorsIgnorePattern': '^_'
            }
        ],
        'react-hooks/exhaustive-deps': 'warn',
        'quotes': ['warn', 'single', {'avoidEscape': true}],
        'eqeqeq': ['warn', 'always'],
        'semi': ['warn', 'never'],
        'import/extensions': [
            'warn',
            'never',
            {
                jsx: 'never',
                json: 'always'
            }
        ],
        'import/no-unresolved': 'off',
        'import/namespace': 'off'
    },
    ignorePatterns: [
        '*.md',
        '*.png',
        '*.gif',
        '*.csv',
        '*.html',
        '*.json',
        '*.css'
    ]
}
