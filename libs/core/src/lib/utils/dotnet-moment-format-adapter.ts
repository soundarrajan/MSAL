/**
 * The internal **DotNet** date formats cache.
 *
 * @property dotnetDateFormats
 * @type {Object}
 */
const dotnetDateFormats = {};

/**
 * The internal **moment.js** date formats cache.
 *
 * @property momentDateFormats
 * @type {Object}
 */
const momentDateFormats = {};

/**
 * The format pattern mapping from DotNet format to momentjs.
 *
 * @property dotnetFormatMapping
 * @type {Object}
 */
const dotnetFormatMapping = {
  d: 'D',
  dd: 'DD',
  DDD: 'ddd', /* This is a hack around legacy shiptech, DDD does not exist in dotnet */
  y: 'YYYY',
  yy: 'YY',
  yyy: 'YYYY',
  yyyy: 'YYYY',
  a: 'a',
  A: 'A',
  M: 'M',
  MM: 'MM',
  MMM: 'MMM',
  MMMM: 'MMMM',
  h: 'h',
  hh: 'hh',
  H: 'H',
  HH: 'HH',
  m: 'm',
  mm: 'mm',
  s: 's',
  ss: 'ss',
  S: 'SSS',
  SS: 'SSS',
  SSS: 'SSS',
  E: 'ddd',
  EE: 'ddd',
  EEE: 'ddd',
  EEEE: 'dddd',
  EEEEE: 'dddd',
  EEEEEE: 'dddd',
  D: 'DDD',
  w: 'W',
  ww: 'WW',
  z: 'ZZ',
  zzzz: 'Z',
  Z: 'ZZ',
  X: 'ZZ',
  XX: 'ZZ',
  XXX: 'Z',
  u: 'E'
};

/**
 * The format pattern mapping from DotNet format to moment.js.
 *
 * @property momentFormatMapping
 * @type {Object}
 */
const momentFormatMapping = {
  D: 'd',
  DD: 'dd',
  YY: 'yy',
  YYY: 'yyyy',
  YYYY: 'yyyy',
  a: 'a',
  A: 'a',
  M: 'M',
  MM: 'MM',
  MMM: 'MMM',
  MMMM: 'MMMM',
  h: 'h',
  hh: 'hh',
  H: 'H',
  HH: 'HH',
  m: 'm',
  mm: 'mm',
  s: 's',
  ss: 'ss',
  S: 'S',
  SS: 'S',
  SSS: 'S',
  ddd: 'E',
  dddd: 'EEEE',
  DDD: 'D',
  W: 'w',
  WW: 'ww',
  ZZ: 'z',
  Z: 'XXX',
  E: 'u'
};

export class DotNetMomentFormatAdapter {
  /**
   * Translates the dotnet date format String to a momentjs format String.
   *
   * @param {String}  formatString    The unmodified format string
   * @param {Object}  mapping         The date format mapping object
   * @returns {String}
   */
  private translateFormat(formatString: string, mapping: Record<string, string>): string {
    const len = formatString.length;
    let i = 0;
    let startIndex = -1;
    let lastChar = null;
    let currentChar = '';
    let resultString = '';

    for (; i < len; i++) {
      currentChar = formatString.charAt(i);

      if (lastChar === null || lastChar !== currentChar) {
        // change detected
        resultString = this.appendMappedString(formatString, mapping, startIndex, i, resultString);

        startIndex = i;
      }

      lastChar = currentChar;
    }

    return this.appendMappedString(formatString, mapping, startIndex, i, resultString);
  };

  /**
   * Checks if the substring is a mapped date format pattern and adds it to the result format String.

   * @param {String}  formatString    The unmodified format String.
   * @param {Object}  mapping         The date format mapping Object.
   * @param {Number}  startIndex      The begin index of the continuous format characters.
   * @param {Number}  currentIndex    The last index of the continuous format characters.
   * @param {String}  resultString    The result format String.
   * @returns {String}
   * @private
   */
  private appendMappedString(formatString: string, mapping: Record<string, string>, startIndex: number, currentIndex: number, resultString: string): string {
    if (startIndex !== -1) {
      let tempString = formatString.substring(startIndex, currentIndex);

      // check if the temporary string has a known mapping
      if (mapping[tempString]) {
        tempString = mapping[tempString];
      }

      resultString += tempString;
    }

    return resultString;
  };

  /**
   * Translates the dotnet format string to a momentjs date format string
   *
   * @param {String}  formatString    The format String to be translated.
   * @returns {String}
   */
  toMomentFormatString(formatString: string): string {
    if (!dotnetDateFormats[formatString]) {
      let mapped = '';
      const regexp = /[^']+|('[^']*')/g;
      let part;

      while ((part = regexp.exec(formatString))) {
        part = part[0];

        if (part.match(/'(.*?)'/)) {
          mapped += '[' + part.substring(1, part.length - 1) + ']';
        } else {
          mapped += this.translateFormat(part, dotnetFormatMapping);
        }
      }

      dotnetDateFormats[formatString] = mapped;
    }

    return dotnetDateFormats[formatString];
  };

  /**
   * Translates the momentjs format string to a dotnet date format string
   *
   * @param {String}  formatString    The format String to be translated.
   * @returns {String}
   */
  toDotNetFormat(formatString: string): string {
    if (!momentDateFormats[formatString]) {
      momentDateFormats[formatString] = this.translateFormat(formatString, momentFormatMapping);
    }

    return momentDateFormats[formatString];
  };
}

const instance = new DotNetMomentFormatAdapter();
export default {
  fromDotNet: (format: string) => instance.toMomentFormatString(format)
};
