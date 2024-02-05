module.exports = {
    extends: [
        '../.eslintrc.cjs'
    ],
    rules: {
        'import/extensions': [
            'warn',
            'never',
            {
                js: 'always',
                jsx: 'never',
                json: 'always'
            }
        ]
    }
}
