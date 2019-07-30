export function defaultComparer(valueA: any, valueB: any, accentedCompare: boolean = false): number {
  const valueAMissing = valueA === null || valueA === undefined;
  const valueBMissing = valueB === null || valueB === undefined;

  // Note: Currently ag-grid does a lexicographically compare of strings which is not natural
  // Note: We took the default comparer from ag-grid source and updated it to comapre with localCompare
  // https://github.com/ag-grid/ag-grid/blob/12efbfd1b84281c6d4722d9125b802160a1bf589/packages/ag-grid-community/src/ts/utils.ts

  // this is for aggregations sum and avg, where the result can be a number that is wrapped.
  // if we didn't do this, then the toString() value would be used, which would result in
  // the strings getting used instead of the numbers.
  if (valueA && valueA.toNumber) {
    valueA = valueA.toNumber();
  }
  if (valueB && valueB.toNumber) {
    valueB = valueB.toNumber();
  }

  if (valueAMissing && valueBMissing) {
    return 0;
  }
  if (valueAMissing) {
    return -1;
  }
  if (valueBMissing) {
    return 1;
  }

  if (typeof valueA === 'string') {
    if (!accentedCompare) {
      return doQuickCompare(valueA, valueB);
    } else {
      try {
        // using local compare also allows chinese comparisons
        return valueA.localeCompare(valueB);
      } catch (e) {
        // if something wrong with localeCompare, eg not supported
        // by browser, then just continue with the quick one
        return doQuickCompare(valueA, valueB);
      }
    }
  }

  if (valueA < valueB) {
    return -1;
  } else if (valueA > valueB) {
    return 1;
  } else {
    return 0;
  }

  function doQuickCompare(a: string, b: string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }
}
