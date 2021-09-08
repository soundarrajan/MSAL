module.exports = {
  name: 'feature-delivery',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/delivery',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
