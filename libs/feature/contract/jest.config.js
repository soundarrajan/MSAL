module.exports = {
  name: 'feature-contract',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/contract',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
