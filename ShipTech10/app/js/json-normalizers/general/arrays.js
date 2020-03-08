/**
* Normalizes an array of objects into a hash indexed with the values of the specified object property.
* @param {Array} source - The array of objects.
* @param {String} keyProperty - The object property whose values should be used as keys. Should exist in all the objects,
*   and be unique across the array!
* @returns {Object} A hash of objects.
*/
function normalizeArrayToHash(source, keyProperty) {
    if (typeof source === 'undefined' || source === null) {
        return null;
    }

    let result = {};

    for(let i = 0; i < source.length; i++) {
        result[source[i][keyProperty]] = source[i];
    }

    return result;
}
