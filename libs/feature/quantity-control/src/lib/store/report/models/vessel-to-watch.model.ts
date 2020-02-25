import { IVesselToWatchLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class VesselToWatchModel {
  private _result: IVesselToWatchLookupDto;

  constructor() {
    this._result = {
      id: 0,
      name: '',
      displayName: '',
      vesselToWatchFlag: false
    };
  }

  get result(): IVesselToWatchLookupDto {
    return this._result;
  }

  set result(value: IVesselToWatchLookupDto) {
    if (value) {
      Object.defineProperty(this._result, 'id', {
        value: value.id,
        writable: true,
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(this._result, 'name', {
        value: value.name,
        writable: true,
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(this._result, 'displayName', {
        value: value.displayName,
        writable: true,
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(this._result, 'vesselToWatchFlag', {
        value: value.vesselToWatchFlag,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  }
}
