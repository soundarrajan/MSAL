module.exports = {
  name: 'feature-ete',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/ete',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
