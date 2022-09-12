const fs = require('fs');
const _ = require('lodash');

module.exports = {
  plugins: []
};

mergeSettings();

function mergeSettings(outputDir = './assets/config', outputFile = 'settings.runtime.json') {
  const directory = './assets/config';
  const mainSettingsPath = `${directory}/settings.json`;

  const currentEnvironment = process.env.ANGULAR_ENVIRONMENT;
  const customSettingsPath = `${directory}/settings.{ENV_VAR}.json`.replace('{ENV_VAR}', currentEnvironment);

  const mainSettings = readJsonFile(mainSettingsPath) || {};
  let customSettings = {};

  if (!process.env.ANGULAR_ENVIRONMENT) {
    console.info('Using default settings.json file. ANGULAR_ENVIRONMENT environment variable not set.');
  } else {
    customSettings = readJsonFile(customSettingsPath, false);
  }

  fs.writeFileSync(`${outputDir}/${outputFile}`, JSON.stringify(_.assign(mainSettings, customSettings), null, 4));
}

function readJsonFile(path, throwError = true) {
  const filePathExists = fs.existsSync(path);

  if (throwError && !filePathExists) {
    throw Error(`Settings file with path ${path} not found`);
  }

  try {
    return JSON.parse(fs.readFileSync(path), 'utf8');
  } catch (e) {
    if (throwError) {
      console.error(`Invalid file with path ${path}`);
      throw e;
    }

    return undefined;
  }
}
