module.exports = {
  name: 'feature-smart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/smart',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
