module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/config/', '/utils/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/config/', '/utils/'],

  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ],
  testEnvironment: 'node'
};
