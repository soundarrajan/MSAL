import { Injectable } from '@angular/core';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { VesselDataModel, FuelDetails, VesselLocation, RequestDetail } from '../shared/models/vessel.data.model';
import { BehaviorSubject } from 'rxjs';
import {
    IAuditLogRequest,
    IAuditLogResponse
  } from '@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto';
  

export namespace UserRoleApiPaths {
    export const getUserRole = () => `api/BOPS/Roles/GetBOPSRoles`;
}
export namespace VesselListApiPaths {
    export const getVesselList = () => `api/infrastructure/static/lists`;
}
export namespace VesselImportPlanStatusApiPaths {
    export const GetVesselImportPlanStatus = () => `api/BOPS/Roles/GetVesselImportPlanStatus`;
}
export namespace BunkerPlanHeaderApiPaths {
    export const GetBunkerPlanHeader = () => `api/BOPS/bunkerplan/getHeader`;
}
export namespace BunkerPlanLogApiPaths {
    export const GetBunkerPlanLog = () => `api/BOPS/bunkerplan/getLog`;
}
export namespace GetROBArbitrageApiPaths {
    export const GetROBArbitrageUrl = () => `api/BOPS/bunkerplan/get/BunkerPlanHeader`;
}

export namespace GetbunkerPlanIDApiPaths {
    export const GetbunkerPlanIDUrl = () => `api/BOPS/bunkerplan/getBunkerPlanInitial`;
}
export namespace GetCurrentROBApiPaths {
    export const GetCurrentROB = () => `api/BOPS/bunkerplan/getCurrentROB`;
}
export namespace GetProcurementApiPaths {
    export const GetProcurementRequest = () => `api/procurement/request/tableView`;
}

export namespace AuditLogApiPaths {
    export const getAuditLog = () => `api/admin/audit/get`;
  }
export namespace GetUnmanagedVesselsApiPath{
    export const getUnmanagedVessels = ()=> 'api/BOPS/bunkerplan/getUnmanageableVessels';
} 

@Injectable({
    providedIn: 'root'
})
export class LocalService {

    private isDarkTheme = new BehaviorSubject<boolean>(true);
    themeChange = this.isDarkTheme.asObservable();

    private bunkerPlanChanged = new BehaviorSubject<boolean>(false);
    isBunkerPlanEdited = this.bunkerPlanChanged.asObservable();

    private veselPopUpData = new BehaviorSubject<Object>({});
    vesselPopUpDetails = this.veselPopUpData.asObservable();

    private portPopUpData = new BehaviorSubject([]);
    portPopUpDetails = this.portPopUpData.asObservable();

    private totalPortPopupOpen = new BehaviorSubject(0);
    openedPortPopupCount = this.totalPortPopupOpen.asObservable();

    private routeOpen = new BehaviorSubject(false);
    isRouteOpen = this.routeOpen.asObservable();

    retryCount:number = 2;
    api: any;
    headersProp: HttpHeaders;

    @ApiCallUrl()
    protected _apiUrlAdmin = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;
    protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_BOPS;
    protected _apiUrlInfra = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;
    protected _apiUrlProcure = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
        // this.headersProp = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, );   
        this.headersProp = new HttpHeaders();
        this.headersProp.append('Content-Type', 'application/json');   
        this.getVesselsList().subscribe(data => {
            // console.log(data);
        });

        this.getCountriesList().subscribe(data => {
            // console.log(data);
        });

    }
    setTheme(flag) {
        this.isDarkTheme.next(flag);
    }
    getTheme() {
        return this.isDarkTheme.value;
    }

    setBunkerPlanState(flag) {
        this.bunkerPlanChanged.next(flag);
    }
    getBunkerPlanState() {
        return this.bunkerPlanChanged.value;
    }
    setVesselPopupData(data) {
        this.veselPopUpData.next(data);
    }
    setPortPopupData(data) {
        this.portPopUpData.next(data);
    }

    setOpenPortPopupCount(data) {
        this.totalPortPopupOpen.next(data);
    }

    setRouteFlag(data) {
        this.routeOpen.next(data);
    }

    checkVesselNormal(robColorCode: any): boolean {
        if (robColorCode == '')
            return true;
    }

    checkVesselAbormal(robColorCode: any): boolean {
        if (robColorCode == 'red-threshold-box')
            return true;
    }

    public getVesselsList(): Observable<any> {
        return this.http.get("./assets/data/vessels-list.json").pipe(
            map((res: any[]) => {
                let vesselList: VesselDataModel[] = [];
                let vesselROBDOGOColor, vesselROBHSFOColor, vesselROBULSFOColor, colorCodes: any[];
                res.forEach(vessel => {
                    if (vessel.ROBDOGO != undefined && vessel.MinimumROBDOGO != undefined && vessel.MaximumROBDOGO != undefined)
                        vesselROBDOGOColor = vessel.ROBDOGO < vessel.MinimumROBDOGO ? "red" : (vessel.ROBDOGO > vessel.MinimumROBDOGO && vessel.ROBDOGO < vessel.MaximumROBDOGO) ? "blue" : "orange";
                    if (vessel.ROBHSFO != undefined && vessel.MinimumROBHSFO != undefined && vessel.MaximumROBHSFO != undefined)
                        vesselROBHSFOColor = vessel.ROBHSFO < vessel.MinimumROBHSFO ? "red" : (vessel.ROBHSFO > vessel.MinimumROBHSFO && vessel.ROBHSFO < vessel.MaximumROBHSFO) ? "blue" : "orange";//vessel.ROB.HSFO.Color 
                    if (vessel.ROBULSFO != undefined && vessel.MinimumROBULSFO != undefined && vessel.ROBULSFO != undefined && vessel.MaximumROBULSFO != undefined)
                        vesselROBULSFOColor = vessel.ROBULSFO < vessel.MinimumROBULSFO ? "red" : (vessel.ROBULSFO > vessel.MinimumROBULSFO && vessel.ROBULSFO < vessel.MaximumROBULSFO) ? "blue" : "orange";//vessel.ROB.ULSFO.Color
                    colorCodes = [vesselROBHSFOColor == 'red' ? 'red-threshold-box' : (vesselROBHSFOColor == 'orange') ? 'orange-threshold-box' : '', vesselROBULSFOColor == 'red' ? 'red-threshold-box' : (vesselROBULSFOColor == 'orange') ? 'orange-threshold-box' : '', vesselROBDOGOColor == 'red' ? 'red-threshold-box' : (vesselROBDOGOColor == 'orange') ? 'orange-threshold-box' : ''];
                    vesselList.push(
                        <VesselDataModel>
                        {
                            ShiptechVesselId: vessel.ShiptechVesselId,
                            VesselIMONO: vessel.VesselIMONO,
                            VesselName: vessel.VesselName,
                            VesselType: vessel.VesselType,
                            ROB: {
                                HSFO: <FuelDetails>{ Value: vessel.ROBHSFO == undefined ? 0 : vessel.ROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                ULSFO: <FuelDetails>{ Value: vessel.ROBULSFO == undefined ? 0 : vessel.ROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                DOGO: <FuelDetails>{ Value: vessel.ROBDOGO == undefined ? 0 : vessel.ROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                Color: colorCodes.every(this.checkVesselNormal) ? 'tbl-blue' : colorCodes.some(this.checkVesselAbormal) ? 'tbl-red' : 'tbl-orange',
                                ColorCode: ''
                            },
                            StandardROB: {
                                HSFO: <FuelDetails>{ Value: vessel.StandardROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                ULSFO: <FuelDetails>{ Value: vessel.StandardROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                DOGO: <FuelDetails>{ Value: vessel.StandardROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                Color: '',
                                ColorCode: ''
                            },
                            MinimumROB: {
                                HSFO: <FuelDetails>{ Value: vessel.MinimumROBHSFO == undefined ? 0 : vessel.MinimumROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                ULSFO: <FuelDetails>{ Value: vessel.MinimumROBULSFO == undefined ? 0 : vessel.MinimumROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                DOGO: <FuelDetails>{ Value: vessel.MinimumROBDOGO == undefined ? 0 : vessel.MinimumROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                Color: '',
                                ColorCode: ''
                            },
                            MaximumROB: {
                                HSFO: <FuelDetails>{ Value: vessel.MaximumROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                ULSFO: <FuelDetails>{ Value: vessel.MaximumROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                DOGO: <FuelDetails>{ Value: vessel.MaximumROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                Color: '',
                                ColorCode: ''
                            },
                            StartLocation: <VesselLocation>{
                                LocationId: vessel.StartLocationId,
                                LocationName: vessel.StartLocation,
                                ETA: vessel.StartLocationETA,
                                ETB: vessel.StartLocationETB,
                                Latitude: vessel.StartLatitude != undefined ? vessel.StartLatitude : 0,
                                Longitude: vessel.StartLongitude != undefined ? vessel.StartLongitude : 0,
                                Schedule: false,
                                Status: ''
                            },
                            EndLocation: <VesselLocation>{
                                LocationId: vessel.EndLocationId,
                                LocationName: vessel.EndLocation,
                                ETA: vessel.EndLocationETA,
                                ETB: vessel.EndLocationETB,
                                Latitude: vessel.EndLatitude != undefined ? vessel.EndLatitude : 0,
                                Longitude: vessel.EndLongitude != undefined ? vessel.EndLongitude : 0,
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
                            Request: <RequestDetail>{ RequestCreatedOn: vessel.RequestCreatedOn, RequestId: vessel.RequestId, RequestName: vessel.RequestName, RequestStatus: vessel.RequestStatus, RequestUpdatedOn: vessel.RequestUpdatedOn },
                            LastAction: new Date(),
                            Comments: null,
                            CommentsCount: vessel.Comments,
                            VoyageDetails: [],
                            VoyageStatus: vessel.VoyageStatus,
                            VoyageCode: vessel.VoyageCode
                        })

                });

                return vesselList;
            },
                (error) => {

                    return null;
                })
        );
    }

    public getVesselsList_red(): Observable<any> {
        return this.http.get("./assets/data/vessels-list.json").pipe(
            map((res: any[]) => {
                let vesselList: VesselDataModel[] = [];
                let vesselROBDOGOColor, vesselROBHSFOColor, vesselROBULSFOColor, colorCodes: any[];
                res.forEach(vessel => {
                    if (vessel.ROBDOGO != undefined && vessel.MinimumROBDOGO != undefined && vessel.MaximumROBDOGO != undefined)
                        vesselROBDOGOColor = vessel.ROBDOGO < vessel.MinimumROBDOGO ? "red" : (vessel.ROBDOGO > vessel.MinimumROBDOGO && vessel.ROBDOGO < vessel.MaximumROBDOGO) ? "blue" : "orange";
                    if (vessel.ROBHSFO != undefined && vessel.MinimumROBHSFO != undefined && vessel.MaximumROBHSFO != undefined)
                        vesselROBHSFOColor = vessel.ROBHSFO < vessel.MinimumROBHSFO ? "red" : (vessel.ROBHSFO > vessel.MinimumROBHSFO && vessel.ROBHSFO < vessel.MaximumROBHSFO) ? "blue" : "orange";//vessel.ROB.HSFO.Color 
                    if (vessel.ROBULSFO != undefined && vessel.MinimumROBULSFO != undefined && vessel.ROBULSFO != undefined && vessel.MaximumROBULSFO != undefined)
                        vesselROBULSFOColor = vessel.ROBULSFO < vessel.MinimumROBULSFO ? "red" : (vessel.ROBULSFO > vessel.MinimumROBULSFO && vessel.ROBULSFO < vessel.MaximumROBULSFO) ? "blue" : "orange";//vessel.ROB.ULSFO.Color
                    colorCodes = [vesselROBHSFOColor == 'red' ? 'red-threshold-box' : (vesselROBHSFOColor == 'orange') ? 'orange-threshold-box' : '', vesselROBULSFOColor == 'red' ? 'red-threshold-box' : (vesselROBULSFOColor == 'orange') ? 'orange-threshold-box' : '', vesselROBDOGOColor == 'red' ? 'red-threshold-box' : (vesselROBDOGOColor == 'orange') ? 'orange-threshold-box' : ''];
                    if (vesselROBHSFOColor == 'red') {
                        vesselList.push(
                            <VesselDataModel>
                            {
                                ShiptechVesselId: vessel.ShiptechVesselId,
                                VesselIMONO: vessel.VesselIMONO,
                                VesselName: vessel.VesselName,
                                VesselType: vessel.VesselType,
                                ROB: {
                                    HSFO: <FuelDetails>{ Value: vessel.ROBHSFO == undefined ? 0 : vessel.ROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    ULSFO: <FuelDetails>{ Value: vessel.ROBULSFO == undefined ? 0 : vessel.ROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    DOGO: <FuelDetails>{ Value: vessel.ROBDOGO == undefined ? 0 : vessel.ROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    Color: colorCodes.every(this.checkVesselNormal) ? 'tbl-blue' : colorCodes.some(this.checkVesselAbormal) ? 'tbl-red' : 'tbl-orange',
                                    ColorCode: ''
                                },
                                StandardROB: {
                                    HSFO: <FuelDetails>{ Value: vessel.StandardROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    ULSFO: <FuelDetails>{ Value: vessel.StandardROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    DOGO: <FuelDetails>{ Value: vessel.StandardROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    Color: '',
                                    ColorCode: ''
                                },
                                MinimumROB: {
                                    HSFO: <FuelDetails>{ Value: vessel.MinimumROBHSFO == undefined ? 0 : vessel.MinimumROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    ULSFO: <FuelDetails>{ Value: vessel.MinimumROBULSFO == undefined ? 0 : vessel.MinimumROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    DOGO: <FuelDetails>{ Value: vessel.MinimumROBDOGO == undefined ? 0 : vessel.MinimumROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    Color: '',
                                    ColorCode: ''
                                },
                                MaximumROB: {
                                    HSFO: <FuelDetails>{ Value: vessel.MaximumROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    ULSFO: <FuelDetails>{ Value: vessel.MaximumROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    DOGO: <FuelDetails>{ Value: vessel.MaximumROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
                                    Color: '',
                                    ColorCode: ''
                                },
                                StartLocation: <VesselLocation>{
                                    LocationId: vessel.StartLocationId,
                                    LocationName: vessel.StartLocation,
                                    ETA: vessel.StartLocationETA,
                                    ETB: vessel.StartLocationETB,
                                    Latitude: vessel.StartLatitude != undefined ? vessel.StartLatitude : 0,
                                    Longitude: vessel.StartLongitude != undefined ? vessel.StartLongitude : 0,
                                    Schedule: false,
                                    Status: ''
                                },
                                EndLocation: <VesselLocation>{
                                    LocationId: vessel.EndLocationId,
                                    LocationName: vessel.EndLocation,
                                    ETA: vessel.EndLocationETA,
                                    ETB: vessel.EndLocationETB,
                                    Latitude: vessel.EndLatitude != undefined ? vessel.EndLatitude : 0,
                                    Longitude: vessel.EndLongitude != undefined ? vessel.EndLongitude : 0,
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
                                Request: <RequestDetail>{ RequestCreatedOn: vessel.RequestCreatedOn, RequestId: vessel.RequestId, RequestName: vessel.RequestName, RequestStatus: vessel.RequestStatus, RequestUpdatedOn: vessel.RequestUpdatedOn },
                                LastAction: new Date(),
                                Comments: null,
                                CommentsCount: vessel.Comments,
                                VoyageDetails: [],
                                VoyageStatus: vessel.VoyageStatus,
                                VoyageCode: vessel.VoyageCode
                            })
                    }
                });

                return vesselList;
            },
                (error) => {

                    return null;
                })
        );
    }


    public getCountriesList(): Observable<any> {
        return this.http.get("./assets/data/countries-list.json");
    }

    public getMarketprice(): Observable<any> {
        return this.http.get("./assets/data/marketprice.json");
    }

    public getSeaRouteList(): Observable<any> {
        return this.http.get("./assets/data/searoute-list.json");
    }
    // public GetSeaRouteList(imono) {
    //     return this.http.get(this.api.baseUrl + "/api/VoyageRoute/GetRoute?imono=" + imono).pipe(
    //         retry(this.retryCount),
    //         catchError(this.handleError.bind(this))
    //       );
    // }

    public getSeaRoute(vesselIMONO): Observable<any> {
        return this.http.get("./assets/data/route_" + vesselIMONO + ".json");
    }

    public getNotificationAlerts(type,id){
        let url = this.api + "/api/Alert/GetNotifications/"+type+"/"+id;
        return this.http.get(url).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
          );
    }

    public postFileToBlob(fileArray: any, fileName, tenantId) {

        var base64Arr = fileArray.split("base64,")[1];
        var obj = {
            ByteValue: base64Arr,
            FileName: fileName,
            Extension: "",
            TenantId : tenantId
        };
        return this.http.post(this.api.integrationUrl + "/api/BlobStorage/UploadBlobFile", obj, { headers: this.headersProp, responseType: 'text' }).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
          );
    }

    public getBlobFile(fileName: any, fileExtension : any, tenantId) {
        return this.http.get(this.api.integrationUrl + "/api/BlobStorage/GetBlob?TenantId="+ tenantId +"&FileName="+ fileName + "&FileExtension=" + fileExtension, { headers: this.headersProp, responseType: 'text' });
    }

    public GetRequestStatusColor() {   
        return this.http.get(this.api.dataServiceUrl + "/api/RequestStatusColorCode").pipe(
        retry(this.retryCount),
        catchError(this.handleError.bind(this))
      );    
    }

    public getLocations() {
        return this.http.get(this.api.baseUrl + "/api/Locations").pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
          );
    }

    public getLocationByName(locationName: string) {
        return this.http.get(this.api.dataServiceUrl + "/api/Location/GetLocationByName/" + locationName).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
          );
    }

    public getTenantDetails() {
        return this.http.get('./assets/data/filter-detail.json').pipe(map((res) => {

            return res;
        },
            (error) => {

                null;
            }),
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
    }

    public getMarketPriceByLocation(locationName) {
        var url = this.api.baseUrl + "/api/Vessels/" + locationName;
        return this.http.get(url).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );//.map((res) => {

    }

    public GetTodayMarketPrice() {
        var url = this.api.baseUrl + "/api/MarketPrice/GetTodayMarketPrice";
        return this.http.get(url).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );//.map((res) => {
    }

    public getAlertParameters(){
        var url = this.api.dataServiceUrl + "/api/Alert/AlertParameters";        
        return this.http.get(url).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
    }
    
    public createNewAlert(values:any){
        var url = this.api.dataServiceUrl + "/api/Alert/CreateUpdateAlert";        
        return this.http.post(url,values, { headers: this.headersProp, responseType: 'text' }).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
    }

    public getAlertsList(): Observable<any>{
        var url = this.api.dataServiceUrl + "/api/Alert/GetAlerts";        
        return this.http.get(url).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
    }

    public deleteNotification(AlertId){        
        return this.http.put(this.api.dataServiceUrl + "/api/Alert/DeleteAlertById?AlertId="+AlertId,{}).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
    }

    public clearNotifications(Ids){        
        let clearValues = JSON.stringify(Ids.toString());
        return this.http.put(this.api.dataServiceUrl + "/api/Alert/DeleteNotifications",clearValues, { headers: this.headersProp }).pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
        // return this.http.put(this.appSettings.dataServiceUrl + "/api/Alert/DeleteNotifications?objectId="+Ids,{});
    }

    public clearAllNotifications(){
        return this.http.get(this.api.dataServiceUrl + "/api/Alert/DeleteAllNotifications").pipe(
            retry(this.retryCount),
            catchError(this.handleError.bind(this))
        );
        // return this.http.put(this.appSettings.dataServiceUrl + "/api/Alert/DeleteNotifications?objectId="+Ids,{});
    }

    public handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // this.snackbar.open(errorMessage, '', { duration: 0 });
        console.log(errorMessage);
        return throwError(errorMessage);
      }

      public clearItems() {
        localStorage.setItem('selectedROBOption', null);
        localStorage.removeItem('selectedROBOption');

        localStorage.setItem('lastVesselFilterConditionApplied', null);
        localStorage.removeItem('lastVesselFilterConditionApplied');

        localStorage.setItem('filteredVessels', null);
        localStorage.removeItem('filteredVessels');
    }

    public newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // getBunkerUserRole to get bunker user roles
    @ObservableException()
    getBunkerUserRole(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${UserRoleApiPaths.getUserRole()}`,
        { payload: request }, { headers: this.headersProp }
      );
    }
    // VesselListApiPaths to get vessel imono data
    @ObservableException()
    getVesselListImono(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrlInfra}/${VesselListApiPaths.getVesselList()}`,
        { payload: request }
      ).pipe(
          map(txs => txs.find(txn => txn.name =="VesselWithImo"))
      );
    }

    @ObservableException()
    getVesselListall(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrlInfra}/${VesselListApiPaths.getVesselList()}`,
        { payload: request }
      )
    }


    // // VesselListApiPaths to get vessel imono data
    // @ObservableException()
    // getVesselListCode(request: any): Observable<any> {
    //   return this.http.post<any>(
    //     `${this._apiUrlInfra}/${VesselListApiPaths.getVesselList()}`,
    //     { payload: request }
    //   ).pipe(
    //       map(txs => txs.find((txn => txn.name == "Vessel") &&  (txn => txn.name =="VesselWithImo")))
    //   );
    // }
    
    // getBunkerUserRole to get bunker user roles
    @ObservableException()
    getVesselList(request: any=undefined): Observable<any> {
    let db;
    let dbReq = indexedDB.open('Shiptech-UI.Lookups', 10);
    return new Observable((observer) => {
            dbReq.onsuccess = function(event) {
                db = dbReq.result;
                var transaction = db.transaction(['vessel'], 'readonly');
                var objectStore = transaction.objectStore("vessel");
                var objectStoreRequest = objectStore.getAll();

                objectStoreRequest.onsuccess = function(event) {
                   var response = event.target.result;
                   
                   if (response) {
                    observer.next(response);
                    observer.complete();
                   }
                }
            }
            dbReq.onerror = function(event) {
              alert('error opening database ' + event.target);
            }
        })
    }
    
    // getBunkerUserRole to get bunker user roles
    @ObservableException()
    checkVesselHasNewPlan(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${VesselImportPlanStatusApiPaths.GetVesselImportPlanStatus()}`,
        { payload: request }
      );
    }
    // getBunkerPalnHeader to get bunker plan header details based on vessel change
    @ObservableException()
    getBunkerPlanHeader(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${BunkerPlanHeaderApiPaths.GetBunkerPlanHeader()}`,
        { payload: request }
      );
    }
    // loadROBArbitrage to get roband arbitrage details based on vessel change
    @ObservableException()
    loadROBArbitrage(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${GetCurrentROBApiPaths.GetCurrentROB()}`,
        {payload: request}
      );
    }

    // getBunkerPlanLog to get bunker plan log details based on vessel change
    @ObservableException()
    getBunkerPlanLog(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${BunkerPlanLogApiPaths.GetBunkerPlanLog()}`,
        { payload: request }
      );
    }

    @ObservableException()
  getAuditLog(request: any): Observable<IAuditLogResponse> {
    return this.http.post<IAuditLogResponse>(
      `${this._apiUrlAdmin}/${AuditLogApiPaths.getAuditLog()}`,
      { payload: request }
    );
  }
      
    // bunkerplanId to get plan id for rob, arbitrage details based on vessel change
    @ObservableException()
    getBunkerPlanId(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${GetbunkerPlanIDApiPaths.GetbunkerPlanIDUrl()}`,
        {payload: request}
      );
    }
    // updateROBArbitrageChanges to put current ROB row detail on vessel role
    @ObservableException()
    updateROBArbitrageChanges(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${GetROBArbitrageApiPaths.GetROBArbitrageUrl()}`,
        {payload: request}
      );
    }
    // getOutstandRequestData to put current ROB row detail on vessel role
    @ObservableException()
    getOutstandRequestData(request: any, ColorCode?: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrlProcure}/${GetProcurementApiPaths.GetProcurementRequest()}`,
        request
      )
      .pipe(map(items => {
          (items.payload).map(item => {
            console.log(item);
                if(ColorCode) {
                    item.requestStatus['colorCode'] = ColorCode.find(code=> 
                        (code.id == item.requestStatus?.id) && (code.transactionTypeId == item.requestStatus?.transactionTypeId))
                    return item;
                } else {
                    return item;
                }
            })
            return items;
        }
        ));
    }

    

 @ObservableException()
getUnmanagedVessels(request: any): Observable<any> {
  return this.http.post<any>(
    `${this._apiUrl}/${GetUnmanagedVesselsApiPath.getUnmanagedVessels()}`,
    { payload: request }
  )
}

    // public getVesselByName(vesselName): Observable<any> {
    //     console.log(vesselName)
    //     return this.http.get("./assets/data/vessels-list.json").pipe(
    //         map((res: any[]) => {
    //             let vesselList: VesselDataModel[] = [];
    //             let vesselROBDOGOColor, vesselROBHSFOColor, vesselROBULSFOColor, colorCodes: any[];
    //             res.forEach(vessel => {
    //                 if (vessel.VesselName == vesselName) {
    //                     if (vessel.ROBDOGO != undefined && vessel.MinimumROBDOGO != undefined && vessel.MaximumROBDOGO != undefined)
    //                         vesselROBDOGOColor = vessel.ROBDOGO < vessel.MinimumROBDOGO ? "red" : (vessel.ROBDOGO > vessel.MinimumROBDOGO && vessel.ROBDOGO < vessel.MaximumROBDOGO) ? "blue" : "orange";
    //                     if (vessel.ROBHSFO != undefined && vessel.MinimumROBHSFO != undefined && vessel.MaximumROBHSFO != undefined)
    //                         vesselROBHSFOColor = vessel.ROBHSFO < vessel.MinimumROBHSFO ? "red" : (vessel.ROBHSFO > vessel.MinimumROBHSFO && vessel.ROBHSFO < vessel.MaximumROBHSFO) ? "blue" : "orange";//vessel.ROB.HSFO.Color 
    //                     if (vessel.ROBULSFO != undefined && vessel.MinimumROBULSFO != undefined && vessel.ROBULSFO != undefined && vessel.MaximumROBULSFO != undefined)
    //                         vesselROBULSFOColor = vessel.ROBULSFO < vessel.MinimumROBULSFO ? "red" : (vessel.ROBULSFO > vessel.MinimumROBULSFO && vessel.ROBULSFO < vessel.MaximumROBULSFO) ? "blue" : "orange";//vessel.ROB.ULSFO.Color
    //                     colorCodes = [vesselROBHSFOColor == 'red' ? 'red-threshold-box' : (vesselROBHSFOColor == 'orange') ? 'orange-threshold-box' : '', vesselROBULSFOColor == 'red' ? 'red-threshold-box' : (vesselROBULSFOColor == 'orange') ? 'orange-threshold-box' : '', vesselROBDOGOColor == 'red' ? 'red-threshold-box' : (vesselROBDOGOColor == 'orange') ? 'orange-threshold-box' : ''];
    //                     vesselList.push(
    //                         <VesselDataModel>
    //                         {
    //                             ShiptechVesselId: vessel.ShiptechVesselId,
    //                             VesselIMONO: vessel.VesselIMONO,
    //                             VesselName: vessel.VesselName,
    //                             VesselType: vessel.VesselType,
    //                             ROB: {
    //                                 HSFO: <FuelDetails>{ Value: vessel.ROBHSFO == undefined ? 0 : vessel.ROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 ULSFO: <FuelDetails>{ Value: vessel.ROBULSFO == undefined ? 0 : vessel.ROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 DOGO: <FuelDetails>{ Value: vessel.ROBDOGO == undefined ? 0 : vessel.ROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 Color: colorCodes.every(this.checkVesselNormal) ? 'tbl-blue' : colorCodes.some(this.checkVesselAbormal) ? 'tbl-red' : 'tbl-orange',
    //                                 ColorCode: ''
    //                             },
    //                             StandardROB: {
    //                                 HSFO: <FuelDetails>{ Value: vessel.StandardROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 ULSFO: <FuelDetails>{ Value: vessel.StandardROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 DOGO: <FuelDetails>{ Value: vessel.StandardROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 Color: '',
    //                                 ColorCode: ''
    //                             },
    //                             MinimumROB: {
    //                                 HSFO: <FuelDetails>{ Value: vessel.MinimumROBHSFO == undefined ? 0 : vessel.MinimumROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 ULSFO: <FuelDetails>{ Value: vessel.MinimumROBULSFO == undefined ? 0 : vessel.MinimumROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 DOGO: <FuelDetails>{ Value: vessel.MinimumROBDOGO == undefined ? 0 : vessel.MinimumROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 Color: '',
    //                                 ColorCode: ''
    //                             },
    //                             MaximumROB: {
    //                                 HSFO: <FuelDetails>{ Value: vessel.MaximumROBHSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 ULSFO: <FuelDetails>{ Value: vessel.MaximumROBULSFO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 DOGO: <FuelDetails>{ Value: vessel.MaximumROBDOGO, ColorCode: vessel.ColorCode == undefined ? '' : vessel.ColorCode },
    //                                 Color: '',
    //                                 ColorCode: ''
    //                             },
    //                             StartLocation: <VesselLocation>{
    //                                 LocationId: vessel.StartLocationId,
    //                                 LocationName: vessel.StartLocation,
    //                                 ETA: vessel.StartLocationETA,
    //                                 ETB: vessel.StartLocationETB,
    //                                 Latitude: vessel.StartLatitude != undefined ? vessel.StartLatitude : 0,
    //                                 Longitude: vessel.StartLongitude != undefined ? vessel.StartLongitude : 0,
    //                                 Schedule: false,
    //                                 Status: ''
    //                             },
    //                             EndLocation: <VesselLocation>{
    //                                 LocationId: vessel.EndLocationId,
    //                                 LocationName: vessel.EndLocation,
    //                                 ETA: vessel.EndLocationETA,
    //                                 ETB: vessel.EndLocationETB,
    //                                 Latitude: vessel.EndLatitude != undefined ? vessel.EndLatitude : 0,
    //                                 Longitude: vessel.EndLongitude != undefined ? vessel.EndLongitude : 0,
    //                                 Schedule: false,
    //                                 Status: ''
    //                             },
    //                             CurrentLocation: <VesselLocation>{
    //                                 LocationId: 0,
    //                                 LocationName: vessel.CurrentLocation,
    //                                 ETA: new Date(),
    //                                 ETB: new Date(),
    //                                 Latitude: vessel.Latitude != undefined ? vessel.Latitude : 0,
    //                                 Longitude: vessel.Longitude != undefined ? vessel.Longitude : 0,
    //                                 Schedule: false,
    //                                 Status: ''
    //                             },
    //                             VesselStatus: '',
    //                             Request: <RequestDetail>{ RequestCreatedOn: vessel.RequestCreatedOn, RequestId: vessel.RequestId, RequestName: vessel.RequestName, RequestStatus: vessel.RequestStatus, RequestUpdatedOn: vessel.RequestUpdatedOn },
    //                             LastAction: new Date(),
    //                             Comments: null,
    //                             CommentsCount: vessel.Comments,
    //                             VoyageDetails: [],
    //                             VoyageStatus: vessel.VoyageStatus,
    //                             VoyageCode: vessel.VoyageCode
    //                         })
    //                 }
    //             });

    //             return vesselList;
    //         },
    //             (error) => {

    //                 return null;
    //             })
    //     );
    // }
}
