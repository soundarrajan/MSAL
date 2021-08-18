import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Not found
import {
  VesselDataModel,
  FuelDetails,
  VesselLocation,
  RequestDetail
} from '../core/models/vessel.data.model';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  public showHeader = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {
    this.getVesselsList().subscribe(data => {
      // console.log(data);
    });

    this.getCountriesList().subscribe(data => {
      // console.log(data);
    });
  }

  checkVesselNormal(robColorCode: any): boolean {
    if (robColorCode == '') return true;
  }

  checkVesselAbormal(robColorCode: any): boolean {
    if (robColorCode == 'red-threshold-box') return true;
  }

  public getVesselsList(): Observable<any> {
    return this.http.get('./assets/data/vessels-list.json').pipe(
      map(
        (res: any[]) => {
          let vesselList: VesselDataModel[] = [];
          let vesselROBDOGOColor,
            vesselROBHSFOColor,
            vesselROBULSFOColor,
            colorCodes: any[];
          res.forEach(vessel => {
            if (
              vessel.ROBDOGO != undefined &&
              vessel.MinimumROBDOGO != undefined &&
              vessel.MaximumROBDOGO != undefined
            )
              vesselROBDOGOColor =
                vessel.ROBDOGO < vessel.MinimumROBDOGO
                  ? 'red'
                  : vessel.ROBDOGO > vessel.MinimumROBDOGO &&
                    vessel.ROBDOGO < vessel.MaximumROBDOGO
                  ? 'blue'
                  : 'orange';
            if (
              vessel.ROBHSFO != undefined &&
              vessel.MinimumROBHSFO != undefined &&
              vessel.MaximumROBHSFO != undefined
            )
              vesselROBHSFOColor =
                vessel.ROBHSFO < vessel.MinimumROBHSFO
                  ? 'red'
                  : vessel.ROBHSFO > vessel.MinimumROBHSFO &&
                    vessel.ROBHSFO < vessel.MaximumROBHSFO
                  ? 'blue'
                  : 'orange'; //vessel.ROB.HSFO.Color
            if (
              vessel.ROBULSFO != undefined &&
              vessel.MinimumROBULSFO != undefined &&
              vessel.ROBULSFO != undefined &&
              vessel.MaximumROBULSFO != undefined
            )
              vesselROBULSFOColor =
                vessel.ROBULSFO < vessel.MinimumROBULSFO
                  ? 'red'
                  : vessel.ROBULSFO > vessel.MinimumROBULSFO &&
                    vessel.ROBULSFO < vessel.MaximumROBULSFO
                  ? 'blue'
                  : 'orange'; //vessel.ROB.ULSFO.Color
            colorCodes = [
              vesselROBHSFOColor == 'red'
                ? 'red-threshold-box'
                : vesselROBHSFOColor == 'orange'
                ? 'orange-threshold-box'
                : '',
              vesselROBULSFOColor == 'red'
                ? 'red-threshold-box'
                : vesselROBULSFOColor == 'orange'
                ? 'orange-threshold-box'
                : '',
              vesselROBDOGOColor == 'red'
                ? 'red-threshold-box'
                : vesselROBDOGOColor == 'orange'
                ? 'orange-threshold-box'
                : ''
            ];
            vesselList.push(<VesselDataModel>{
              ShiptechVesselId: vessel.ShiptechVesselId,
              VesselIMONO: vessel.VesselIMONO,
              VesselName: vessel.VesselName,
              VesselType: vessel.VesselType,
              ROB: {
                HSFO: <FuelDetails>{
                  Value: vessel.ROBHSFO == undefined ? 0 : vessel.ROBHSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                ULSFO: <FuelDetails>{
                  Value: vessel.ROBULSFO == undefined ? 0 : vessel.ROBULSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                DOGO: <FuelDetails>{
                  Value: vessel.ROBDOGO == undefined ? 0 : vessel.ROBDOGO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                Color: colorCodes.every(this.checkVesselNormal)
                  ? 'tbl-blue'
                  : colorCodes.some(this.checkVesselAbormal)
                  ? 'tbl-red'
                  : 'tbl-orange',
                ColorCode: ''
              },
              StandardROB: {
                HSFO: <FuelDetails>{
                  Value: vessel.StandardROBHSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                ULSFO: <FuelDetails>{
                  Value: vessel.StandardROBULSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                DOGO: <FuelDetails>{
                  Value: vessel.StandardROBDOGO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                Color: '',
                ColorCode: ''
              },
              MinimumROB: {
                HSFO: <FuelDetails>{
                  Value:
                    vessel.MinimumROBHSFO == undefined
                      ? 0
                      : vessel.MinimumROBHSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                ULSFO: <FuelDetails>{
                  Value:
                    vessel.MinimumROBULSFO == undefined
                      ? 0
                      : vessel.MinimumROBULSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                DOGO: <FuelDetails>{
                  Value:
                    vessel.MinimumROBDOGO == undefined
                      ? 0
                      : vessel.MinimumROBDOGO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                Color: '',
                ColorCode: ''
              },
              MaximumROB: {
                HSFO: <FuelDetails>{
                  Value: vessel.MaximumROBHSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                ULSFO: <FuelDetails>{
                  Value: vessel.MaximumROBULSFO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                DOGO: <FuelDetails>{
                  Value: vessel.MaximumROBDOGO,
                  ColorCode:
                    vessel.ColorCode == undefined ? '' : vessel.ColorCode
                },
                Color: '',
                ColorCode: ''
              },
              StartLocation: <VesselLocation>{
                LocationId: vessel.StartLocationId,
                LocationName: vessel.StartLocation,
                ETA: vessel.StartLocationETA,
                ETB: vessel.StartLocationETB,
                Latitude:
                  vessel.StartLatitude != undefined ? vessel.StartLatitude : 0,
                Longitude:
                  vessel.StartLongitude != undefined
                    ? vessel.StartLongitude
                    : 0,
                Schedule: false,
                Status: ''
              },
              EndLocation: <VesselLocation>{
                LocationId: vessel.EndLocationId,
                LocationName: vessel.EndLocation,
                ETA: vessel.EndLocationETA,
                ETB: vessel.EndLocationETB,
                Latitude:
                  vessel.EndLatitude != undefined ? vessel.EndLatitude : 0,
                Longitude:
                  vessel.EndLongitude != undefined ? vessel.EndLongitude : 0,
                Schedule: false,
                Status: ''
              },
              CurrentLocation: <VesselLocation>{
                LocationId: 0,
                LocationName: vessel.CurrentLocation,
                ETA: new Date(),
                ETB: new Date(),
                Latitude: vessel.Latitude != undefined ? vessel.Latitude : 0,
                Longitude: vessel.Longitude != undefined ? vessel.Longitude : 0,
                Schedule: false,
                Status: ''
              },
              VesselStatus: '',
              Request: <RequestDetail>{
                RequestCreatedOn: vessel.RequestCreatedOn,
                RequestId: vessel.RequestId,
                RequestName: vessel.RequestName,
                RequestStatus: vessel.RequestStatus,
                RequestUpdatedOn: vessel.RequestUpdatedOn
              },
              LastAction: new Date(),
              Comments: null,
              CommentsCount: vessel.Comments,
              VoyageDetails: [],
              VoyageStatus: vessel.VoyageStatus,
              VoyageCode: vessel.VoyageCode
            });
          });

          return vesselList;
        },
        error => {
          return null;
        }
      )
    );
  }

  public getVesselsList_red(): Observable<any> {
    return this.http.get('./assets/data/vessels-list.json').pipe(
      map(
        (res: any[]) => {
          let vesselList: VesselDataModel[] = [];
          let vesselROBDOGOColor,
            vesselROBHSFOColor,
            vesselROBULSFOColor,
            colorCodes: any[];
          res.forEach(vessel => {
            if (
              vessel.ROBDOGO != undefined &&
              vessel.MinimumROBDOGO != undefined &&
              vessel.MaximumROBDOGO != undefined
            )
              vesselROBDOGOColor =
                vessel.ROBDOGO < vessel.MinimumROBDOGO
                  ? 'red'
                  : vessel.ROBDOGO > vessel.MinimumROBDOGO &&
                    vessel.ROBDOGO < vessel.MaximumROBDOGO
                  ? 'blue'
                  : 'orange';
            if (
              vessel.ROBHSFO != undefined &&
              vessel.MinimumROBHSFO != undefined &&
              vessel.MaximumROBHSFO != undefined
            )
              vesselROBHSFOColor =
                vessel.ROBHSFO < vessel.MinimumROBHSFO
                  ? 'red'
                  : vessel.ROBHSFO > vessel.MinimumROBHSFO &&
                    vessel.ROBHSFO < vessel.MaximumROBHSFO
                  ? 'blue'
                  : 'orange'; //vessel.ROB.HSFO.Color
            if (
              vessel.ROBULSFO != undefined &&
              vessel.MinimumROBULSFO != undefined &&
              vessel.ROBULSFO != undefined &&
              vessel.MaximumROBULSFO != undefined
            )
              vesselROBULSFOColor =
                vessel.ROBULSFO < vessel.MinimumROBULSFO
                  ? 'red'
                  : vessel.ROBULSFO > vessel.MinimumROBULSFO &&
                    vessel.ROBULSFO < vessel.MaximumROBULSFO
                  ? 'blue'
                  : 'orange'; //vessel.ROB.ULSFO.Color
            colorCodes = [
              vesselROBHSFOColor == 'red'
                ? 'red-threshold-box'
                : vesselROBHSFOColor == 'orange'
                ? 'orange-threshold-box'
                : '',
              vesselROBULSFOColor == 'red'
                ? 'red-threshold-box'
                : vesselROBULSFOColor == 'orange'
                ? 'orange-threshold-box'
                : '',
              vesselROBDOGOColor == 'red'
                ? 'red-threshold-box'
                : vesselROBDOGOColor == 'orange'
                ? 'orange-threshold-box'
                : ''
            ];
            if (vesselROBHSFOColor == 'red') {
              vesselList.push(<VesselDataModel>{
                ShiptechVesselId: vessel.ShiptechVesselId,
                VesselIMONO: vessel.VesselIMONO,
                VesselName: vessel.VesselName,
                VesselType: vessel.VesselType,
                ROB: {
                  HSFO: <FuelDetails>{
                    Value: vessel.ROBHSFO == undefined ? 0 : vessel.ROBHSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  ULSFO: <FuelDetails>{
                    Value: vessel.ROBULSFO == undefined ? 0 : vessel.ROBULSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  DOGO: <FuelDetails>{
                    Value: vessel.ROBDOGO == undefined ? 0 : vessel.ROBDOGO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  Color: colorCodes.every(this.checkVesselNormal)
                    ? 'tbl-blue'
                    : colorCodes.some(this.checkVesselAbormal)
                    ? 'tbl-red'
                    : 'tbl-orange',
                  ColorCode: ''
                },
                StandardROB: {
                  HSFO: <FuelDetails>{
                    Value: vessel.StandardROBHSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  ULSFO: <FuelDetails>{
                    Value: vessel.StandardROBULSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  DOGO: <FuelDetails>{
                    Value: vessel.StandardROBDOGO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  Color: '',
                  ColorCode: ''
                },
                MinimumROB: {
                  HSFO: <FuelDetails>{
                    Value:
                      vessel.MinimumROBHSFO == undefined
                        ? 0
                        : vessel.MinimumROBHSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  ULSFO: <FuelDetails>{
                    Value:
                      vessel.MinimumROBULSFO == undefined
                        ? 0
                        : vessel.MinimumROBULSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  DOGO: <FuelDetails>{
                    Value:
                      vessel.MinimumROBDOGO == undefined
                        ? 0
                        : vessel.MinimumROBDOGO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  Color: '',
                  ColorCode: ''
                },
                MaximumROB: {
                  HSFO: <FuelDetails>{
                    Value: vessel.MaximumROBHSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  ULSFO: <FuelDetails>{
                    Value: vessel.MaximumROBULSFO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  DOGO: <FuelDetails>{
                    Value: vessel.MaximumROBDOGO,
                    ColorCode:
                      vessel.ColorCode == undefined ? '' : vessel.ColorCode
                  },
                  Color: '',
                  ColorCode: ''
                },
                StartLocation: <VesselLocation>{
                  LocationId: vessel.StartLocationId,
                  LocationName: vessel.StartLocation,
                  ETA: vessel.StartLocationETA,
                  ETB: vessel.StartLocationETB,
                  Latitude:
                    vessel.StartLatitude != undefined
                      ? vessel.StartLatitude
                      : 0,
                  Longitude:
                    vessel.StartLongitude != undefined
                      ? vessel.StartLongitude
                      : 0,
                  Schedule: false,
                  Status: ''
                },
                EndLocation: <VesselLocation>{
                  LocationId: vessel.EndLocationId,
                  LocationName: vessel.EndLocation,
                  ETA: vessel.EndLocationETA,
                  ETB: vessel.EndLocationETB,
                  Latitude:
                    vessel.EndLatitude != undefined ? vessel.EndLatitude : 0,
                  Longitude:
                    vessel.EndLongitude != undefined ? vessel.EndLongitude : 0,
                  Schedule: false,
                  Status: ''
                },
                CurrentLocation: <VesselLocation>{
                  LocationId: 0,
                  LocationName: vessel.CurrentLocation,
                  ETA: new Date(),
                  ETB: new Date(),
                  Latitude: vessel.Latitude != undefined ? vessel.Latitude : 0,
                  Longitude:
                    vessel.Longitude != undefined ? vessel.Longitude : 0,
                  Schedule: false,
                  Status: ''
                },
                VesselStatus: '',
                Request: <RequestDetail>{
                  RequestCreatedOn: vessel.RequestCreatedOn,
                  RequestId: vessel.RequestId,
                  RequestName: vessel.RequestName,
                  RequestStatus: vessel.RequestStatus,
                  RequestUpdatedOn: vessel.RequestUpdatedOn
                },
                LastAction: new Date(),
                Comments: null,
                CommentsCount: vessel.Comments,
                VoyageDetails: [],
                VoyageStatus: vessel.VoyageStatus,
                VoyageCode: vessel.VoyageCode
              });
            }
          });

          return vesselList;
        },
        error => {
          return null;
        }
      )
    );
  }

  public getCountriesList(): Observable<any> {
    return this.http.get('./assets/data/countries-list.json');
  }

  public getMarketprice(): Observable<any> {
    return this.http.get('./assets/data/marketprice.json');
  }

  public getSeaRouteList(): Observable<any> {
    return this.http.get('./assets/data/searoute-list.json');
  }

  public getSeaRoute(vesselIMONO): Observable<any> {
    return this.http.get('./assets/data/route_' + vesselIMONO + '.json');
  }

  public getTransferScreenJSON(): Observable<any> {
    return this.http.get(
      './assets/data/config-ui-json/add-movements-transfer.json'
    );
  }
  public getInterTransferScreenJSON(): Observable<any> {
    return this.http.get(
      './assets/data/config-ui-json/add-movements-intertransfer.json'
    );
  }
  public getOtherMovScreenJSON(): Observable<any> {
    return this.http.get(
      './assets/data/config-ui-json/add-movements-other.json'
    );
  }
  public getDeliveryInventoryScreenJSON(): Observable<any> {
    return this.http.get(
      './assets/data/config-ui-json/add-deliverymovements-inventory.json'
    );
  }
  public getDeliveryB2bScreenJSON(): Observable<any> {
    return this.http.get(
      './assets/data/config-ui-json/add-deliverymovements-b2b.json'
    );
  }
  public getSpotDataJSON(): Observable<any> {
    return this.store.selectSnapshot(state => {
      return state.spotNegotiation.rows;
    });
  }
  public getSpotDataRequestData(reqId): Observable<any> {
    return this.http.get(
      './assets/data/ship-tech/spot-request-' + reqId + '.json'
    );
  }

  //   Smart Filter Variables
  public initial_smart_filter_list = [];
  private smart_filter_list = new Subject<any>();
  public initial_smart_filter_status = false;
  private smart_filter_status = new Subject<boolean>();

  //Smart Filter is activated or not
  setSmartFilterStatus(status: boolean) {
    this.initial_smart_filter_status = status;
    this.smart_filter_status.next(status);
  }
  getSmartFilterStatus(): Observable<any> {
    return this.smart_filter_status.asObservable();
  }
  getInitialSmartFilterStatus(): boolean {
    return this.initial_smart_filter_status;
  }
  //Get and set the smart filter parameters
  setSmartFilterData(filters: any) {
    this.initial_smart_filter_list = filters;
    this.smart_filter_list.next(filters);
  }
  getSmartFilterData(): Observable<any> {
    return this.smart_filter_list.asObservable();
  }
  getInitialSmartFilterValue(): any[] {
    return this.initial_smart_filter_list;
  }

  authenticate(username, password) {
    if (username === 'Inatechee' && password === 'SApooAleSmaGoRe@$') {
      this.setCookie('userid', username, 30);
      this.showHeader.next(true);
      return true;
    } else {
      return false;
    }
  }

  private setCookie(
    name: string,
    value: string,
    expireTime: number,
    path: string = ''
  ) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireTime * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  private deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  isUserLoggedIn() {
    let user = this.getCookie('userid');
    if (user) {
      this.showHeader.next(true);
    } else this.logOut();

    return !(user === null);
  }

  logOut() {
    this.deleteCookie('userid');
    this.showHeader.next(false);
    this.router.navigate(['/login']);
  }

  private futureSetTabIndex = new Subject<any>();
  setFutureSettlementTabChange(index) {
    this.futureSetTabIndex.next(index);
  }

  getFutureSettlementTabChange(): Observable<any> {
    return this.futureSetTabIndex.asObservable();
  }
}
