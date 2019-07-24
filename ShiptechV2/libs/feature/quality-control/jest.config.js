module.exports = {
  name: 'feature-quality-control',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/quality-control',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
