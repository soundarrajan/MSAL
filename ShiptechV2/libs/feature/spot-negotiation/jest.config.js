module.exports = {
  name: 'feature-spot-negotiation',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/feature/spot-negotiation',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
