module.exports = {
  name: 'feature-invoice',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/invoice',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
