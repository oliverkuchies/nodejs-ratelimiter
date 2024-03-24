module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    env: {
        node: true,
        jest: true,
        es2020: true
    },
    overrides: [
        {
            files: ['**/*.spec.(t|j)sx?', '**/*.test.(t|j)sx?'],
            plugins: ['jest'],
            extends: ['plugin:jest/recommended'],
        },
        {
            files: ['**/*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 0,
            },
        },
    ],
    extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'eslint:recommended',
        'plugin:import/recommended'
    ],
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'prettier/prettier': 'error',
        'no-console': 'error',
        '@typescript-eslint/ban-ts-comment': 0,
        'no-return-await': 'error',
        'import/prefer-default-export': 0,
    },
};
