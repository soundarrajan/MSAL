module.exports = {
  name: 'feature-quantity-control',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/quantity-control',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
