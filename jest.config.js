module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    globalSetup: './test/setup.ts',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/app.ts',
        "!src/data/migrations/**",
    ],
}
