module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'services/**/*.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        '!**/*.test.js'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true
};
