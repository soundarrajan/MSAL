module.exports = {
  name: 'shiptech',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/shiptech',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
