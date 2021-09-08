module.exports = {
  name: 'lazy-load-poc',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/lazy-load-poc',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
