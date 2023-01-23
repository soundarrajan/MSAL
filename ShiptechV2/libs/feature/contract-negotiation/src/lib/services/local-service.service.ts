import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { VesselDataModel, FuelDetails, VesselLocation, RequestDetail } from '../core/models/vessel.data.model';
import { Router } from '@angular/router';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import _ from 'lodash';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ContractRequest } from '../store/actions/ag-grid-row.action';
import { Store } from '@ngxs/store';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service'; 


@Injectable({
    providedIn: 'root'
})
export class LocalService {

    private isDarkTheme = new BehaviorSubject<boolean>(true);
    themeChange = this.isDarkTheme.asObservable();
    private showPreviewEmail = new BehaviorSubject<boolean>(false);
    contractPreviewEmail = this.showPreviewEmail.asObservable();
    private showNoQuote = new BehaviorSubject<boolean>(false);
    contractNoQuote = this.showNoQuote.asObservable();
    private displayNoQuote = new BehaviorSubject<boolean>(false);
    noQuoteChange = this.displayNoQuote.asObservable();
    private displayEnableQuote = new BehaviorSubject<boolean>(false);
    enableQuoteChange = this.displayEnableQuote.asObservable();
    public URLFrom = '/login';
    public errorurl = '/404';
    public userData;
    public userRoleList;
    public contractRequestDetails;
    counterpartyList: any[];
    masterData: any;
    clrRequest: any = 0;
    private sendRFQButtonStatus = new BehaviorSubject<boolean>(true);
    private contractStatus = new BehaviorSubject<string>('Open');
    public uniqueLocations: string;
    public allRequestDetails: { locations: any[]; };
    private gridRefreshService = new Subject<any>();
    constructor(
        private http: HttpClient,
        private router: Router,
        public format: TenantFormattingService,
        private store : Store,
        private spotNegotiationService: SpotNegotiationService,
        private db: LegacyLookupsDatabase
        ) {
        this.getVesselsList().subscribe(data => {
            // console.log(data);
        });

        this.getCountriesList().subscribe(data => {
            // console.log(data);
        });

        this.getUserDetails().subscribe(data => { this.userData = data; });
        this.getUserRoleList().subscribe(data => { this.userRoleList = data; });
    }
     gridRefreshService$ = this.gridRefreshService.asObservable();
     callGridRefreshService(index) {
       this.gridRefreshService.next(index);
     }

    public showHeader = new Subject<boolean>();

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

    public getSeaRoute(vesselIMONO): Observable<any> {
        return this.http.get("./assets/data/route_" + vesselIMONO + ".json");
    }

    public getTransferScreenJSON(): Observable<any> {
        return this.http.get("./assets/data/config-ui-json/add-movements-transfer.json");
    }
    public getInterTransferScreenJSON(): Observable<any> {
        return this.http.get("./assets/data/config-ui-json/add-movements-intertransfer.json");
    }
    public getOtherMovScreenJSON(): Observable<any> {
        return this.http.get("./assets/data/config-ui-json/add-movements-other.json");
    }
    public getDeliveryInventoryScreenJSON(): Observable<any> {
        return this.http.get("./assets/data/config-ui-json/add-deliverymovements-inventory.json");
    }
    public getDeliveryB2bScreenJSON(): Observable<any> {
        return this.http.get("./assets/data/config-ui-json/add-deliverymovements-b2b.json");
    }
    public getSpotDataJSON(reqID, locID): Observable<any> {
        return this.http.get("./assets/data/ship-tech/spot-grid-data-" + reqID + "-" + locID + ".json");
    }
    public getSpotDataRequestData(reqId): Observable<any> {
        return this.http.get("./assets/data/ship-tech/spot-request-" + reqId + ".json");
    }
    public getSpotDataCommentsData(reqId): Observable<any> {
        return this.http.get("./assets/data/ship-tech/spot-comments-" + reqId + ".json");
    }
    public getContractRequestData(reqId): Observable<any> {
        return this.http.get("./assets/data/contract-negotiation/contract-request-" + reqId + ".json");
    }
    public getContractNegoRequestDetailsJSON(reqId): Observable<any> {
        return this.http.get("./assets/data/contract-negotiation/contract-nego-request-list-" + reqId + ".json");
    }
    public getContractNegoJSON(reqID, locID): Observable<any> {
        return this.http.get("./assets/data/contract-negotiation/contract-nego-" + reqID + "-" + locID + ".json");
        /*if (this.router.url.includes("buyer")) {
            return this.http.get("./assets/data/contract-negotiation/contract-nego-" + reqID + "-" + locID + ".json");
        }
        else {
            return this.http.get("./assets/data/contract-negotiation/contract-negoAp-" + reqID + "-" + locID + ".json");
        }*/
    }
    public getContractNegoChatData(reqId): Observable<any> {
        return this.http.get("./assets/data/contract-negotiation/contract-nego-chat-" + reqId + ".json");
    }
    companyCode;
    public setcompayCode(code) {
        this.companyCode = code;
    }
    public getcompayCode() {
        return this.companyCode
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

    // authenticate(username, password) {
    //     if (username === "Inatechee" && password === "SApooAleSmaGoRe@$") {
    //       this.setCookie('userid',username,30)
    //       this.showHeader.next(true);
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }

    public getUserDetails(): Observable<any> {
        return this.http.get("./assets/config/users.json").pipe(
            map((res: any[]) => {
                return res;
            },
                (error) => {
                    return null;
                })
        )
    }

    // public getUserRoleList(): Observable<any>{ 
    //     return this.http.get("./assets/config/userRoles.json").pipe(
    //         map((res:any[])=>{
    //             return res;
    //         },
    //         (error) => {
    //             return null;
    //         })
    //     )
    // }
    public getUserRoleList(): Observable<any> {
        return this.http.get("./assets/config/userRoles.json");
    }

    authenticate(username, password) {
        let user = this.userData.find((item) => item.username === username && item.password === password);
        if (user) {
            this.setCookie('userid', username, 30);
            this.setCookie('userRole', user.role, 30);
            this.setUserRole(user.role);
            this.showHeader.next(true);
            return true;
        }
        else {
            return false;
        }
    }

    public setCookie(name: string, value: string, expireTime: number, path: string = '') {
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
        }
        else
            this.logOut();

        return !(user === null)
    }

    hasRouteAccess(newRoute) {
        let userRole = this.getCookie('userRole');
        if (userRole == "ADMIN") {
            return true;
        }
        else {
            let roleData = this.userRoleList.find(item => item.role == userRole);
            let paths = newRoute.split('/');
            if (roleData) {
                let k = 1;
                let flag = this.valdatePathAccess(k, paths, roleData.pages);
                if (roleData.pages.length > 0)
                    return this.valdatePathAccess(k, paths, roleData.pages);//considering included files
                else if (roleData.ex_pages.length > 0)
                    return !(this.valdatePathAccess(k, paths, roleData.ex_pages));//considering excluded files
                else
                    return true;
            }
            return false;
        }
    }
    getUserRole() {
        return this.getCookie('userRole');
    }
    valdatePathAccess(index, path, pages) {
        let isFound = false;
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].url && pages[i].url.indexOf(path[index]) == 0) {
                if (++index < path.length)
                    isFound = this.valdatePathAccess(index, path, pages[i].pages);
                else {
                    isFound = true;
                }
                return isFound;
            }
            else
                isFound = false;
        }
        return isFound;
    }

    logOut() {
        this.deleteCookie('userid');
        this.deleteCookie('userRole');
        this.showHeader.next(false);
        this.router.navigate(['/login']);
    }

    private futureSetTabIndex = new Subject<any>();
    setFutureSettlementTabChange(index) {
        this.futureSetTabIndex.next(index)
    }

    getFutureSettlementTabChange(): Observable<any> {
        return this.futureSetTabIndex.asObservable();
    }

    setTheme(flag: boolean) {
        this.isDarkTheme.next(flag);
    }

    getTheme() {
        return this.isDarkTheme.value;
    }

    setContractPreviewEmail(flag: boolean) {
        this.showPreviewEmail.next(flag);
    }

    getContractPreviewEmail() {
        return this.showPreviewEmail.value;
    }

    setContractNoQuote(flag: boolean) {
        this.showNoQuote.next(flag);
    }

    getContractNoQuote() {
        return this.showNoQuote.value;
    }

    setNoQuote(flag: boolean) {
        this.displayNoQuote.next(flag);
    }

    getNoQuote() {
        return this.displayNoQuote.value;
    }

    setEnableQuote(flag: boolean) {
        this.displayEnableQuote.next(flag);
    }

    getEnableQuote() {
        return this.displayEnableQuote.value;
    }

    setSendRFQButtonStauts(flag: boolean){
        this.sendRFQButtonStatus.next(flag);
    }

    getSendRFQButtonStauts(): Observable<boolean> {
        return this.sendRFQButtonStatus.asObservable();
    }

    //For DS login based on user roles
    public loggedinUserRole = '';
    private userRoleSubject = new Subject<String>();

    //Smart Filter is activated or not
    setUserRole(role) {
        this.loggedinUserRole = role;
        this.userRoleSubject.next(role);
    }
    getGetUserRole(): Observable<any> {
        return this.userRoleSubject.asObservable();
    }

    setContractStatus(flag: string){
        this.contractStatus.next(flag);
    }

    getContractStatus(): Observable<string> {
        return this.contractStatus.asObservable();
    }

    private calculatePrice = new BehaviorSubject<boolean>(false);
    calculatePriceUpdate = this.calculatePrice.asObservable();

    updatecalculatePriceStatus(flag) {
        this.calculatePrice.next(flag);
    }

    // private contractPeriodicity = new BehaviorSubject<any>('M');
    // contractPeriodicityUpdate = this.contractPeriodicity.asObservable();

    // updatecontractPeriodicity(p) {
    //     this.contractPeriodicity.next(p);
    // }
    private sendRFQ = new BehaviorSubject<any>(false);
    sendRFQUpdate = this.sendRFQ.asObservable();

    updateSendRFQStatus(p) {
        this.sendRFQ.next(p);
    }

    private periodicity = new BehaviorSubject<any>('M');
    sendPeriodicity = this.periodicity.asObservable();

    updatePeriodicity(p) {
        this.periodicity.next(p);
    }

    private chipSelected = new BehaviorSubject<any>('1');
    sendChipSelected = this.chipSelected.asObservable();

    updateChipSelected(c) {
        this.chipSelected.next(c);
    }

    private rowSelected = new BehaviorSubject<any>(false);
    isRowSelected = this.rowSelected.asObservable();

    updateRowSelected(c) {
        this.rowSelected.next(c);
    }

    @ObservableException()
    getMasterData(): Observable<any> {
    let db;
    let dbReq = indexedDB.open('Shiptech-UI.Lookups', 10);
    return new Observable((observer) => {
            dbReq.onsuccess = function() {
                db = dbReq.result;
                let response = [];
                var objectStore;
                var objectStoreRequest;
                var transaction = db.transaction(['counterparty','product'], 'readonly');
                objectStore = transaction.objectStore("counterparty");
                objectStoreRequest = objectStore.getAll();
                objectStoreRequest.onsuccess = function(event){
                   response['counterparty'] = event.target.result;
                }
                objectStore = transaction.objectStore("product");
                objectStoreRequest = objectStore.getAll();
                objectStoreRequest.onsuccess = function(event){
                   response['product'] = event.target.result;
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

    @ObservableException()
    filterCounterParty(filterValuelue : string){
        return new Observable((observer) => {
        clearInterval(this.clrRequest);
        this.clrRequest = setTimeout(() => {
            this.spotNegotiationService.getResponse(
                null,
                { Filters: [] },
                { SortList: [] },
                [{ ColumnName: 'CounterpartyTypes', Value: '1,2,3,11' }],
                filterValuelue.toLowerCase(),
                { Skip: 0, Take: 25 },
                true
              ).subscribe((res: any) => {
                if (res?.message == 'Unauthorized') return;
                if (res) {
                    observer.next(this.limitCounterPartyList(res.counterpartyListItems));
                    observer.complete();
                }
              });
        },900);
        });
    }

    limitCounterPartyList(obj){
        // obj =  obj.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        let limitList = Object.keys(obj).slice(0, 12).reduce((result, key) => {
        obj[key].name = this.format.htmlDecode(obj[key].name);
        result[key] = obj[key];
        return result;
        }, []);     
        return limitList;
    }

    @ObservableException()
    getMasterListData(items: any): Observable<any> {
    let db;
    let dbReq = indexedDB.open('Shiptech', 10);
    return new Observable((observer) => {
            dbReq.onsuccess = function() {
                db = dbReq.result;
                let response: any;
                let returnArr: any;
                var objectStore;
                var objectStoreRequest;
                var transaction = db.transaction(['listsCache'], 'readonly');
                objectStore = transaction.objectStore("listsCache");
                objectStoreRequest = objectStore.getAll();
                objectStoreRequest.onsuccess = function(event){
                    response = event.target.result[0].data;
                    if (response) {
                        returnArr = _.pick(response, items);
                        observer.next(returnArr);
                        observer.complete();
                    }
                }             
            }
            dbReq.onerror = function(event) {
              alert('error opening database ' + event.target);
            }
        })
    }
    async contractRequestData(response){
        let contractArray = { 
            id: response['id'],
            startDate: response['startDate'],
            endDate: response['endDate'],
            quoteByDate: response['quoteByDate'],
            minValidity: response['minValidity'],
            supplierComments: response['supplierComments'],
            statusId: response['statusId'],
            status: response['status'],
            createdById: response['createdById'],
            createdOn: response['createdOn'],
            lastModifiedById: response['lastModifiedById'],
            lastModifiedOn: response['lastModifiedOn'],
            quantityDetails: response['quantityDetails'],
            locations : []
        };
        let arrDet = {};
        let data = [];
        let arrMainDet = {};
        let uniqueLocations = [];
        this.masterData = await {
            Uom: await this.db.getUomTable({ orderBy: 'name' }),
            Location: await this.db.getLocationList({ orderBy: 'name' }),
            Counterparty: await this.db.getCounterPartyList({ orderBy: 'name' }),
            Product: await this.db.getProductList({ orderBy: 'name' }),
            SpecGroup : await this.db.getSpecGroupList({ orderBy: 'name' })
        }
        this.setContractStatus(response.status);
        Object.entries(response['contractRequestProducts']).forEach(([key, res1]) => {
            let location = this.masterData['Location'].find(el => el.id == res1['locationId']);
            let mainProduct = this.masterData['Product'].find(el => el.id == res1['productId']);
            uniqueLocations.push(location.name);
            Object.entries(res1['contractRequestProductOffers']).forEach(([key, res2]) => {
            this.setSendRFQButtonStauts(false);
            // let counterparty = this.masterData['Counterparty'].find(el => el.id == res2['counterpartyId']);
            let product = this.masterData['Product'].find(el => el.id == res2['productId']);
            let uom = this.masterData['Uom'].find(el => el.id == res2['quantityUomId']);
            let SpecGroupName  = '';
            if(res2['status'] != 'Open'){
                SpecGroupName = this.masterData['SpecGroup'].find(el => el.id == res1['specGroupId']).name;
            }
            arrDet = {
                "check": res2['isSelected'],
                "id": res2['id'],
                "LocationId": res1['locationId'],
                "ProductId": res2['productId'],
                "isSellerSuspended": res2['isSellerSuspended'],
                "ProductName": product?.displayName,
                "requestLocationId": '',
                "requestProductId": res2['contractRequestProductId'],
                "RequestLocationSellerId": '',
                "CounterpartyName": this.format.htmlDecode(res2['counterpartyName']),
                "CounterpartyId": res2['counterpartyId'],
                "IsTemporarlySuspended": '',
                "GenRating": res2['genRating'],
                "PortRating": res2['portRating'],
                "QuotedProductId": '',
                "SpecGroupId": res1['specGroupId'],
                "SpecGroupName": SpecGroupName,
                "MinQuantity": res2['minQuantity'],
                "MaxQuantity": res2['maxQuantity'],
                "quantityUomId": res2['quantityUomId'],
                "MinQuantityUnit" : uom?.name,
                "MaxQuantityUnit" : uom?.name,
                "OfferPrice": this.format.price(res2['offerPrice']),
                "PriceCurrencyId": res2['currencyId'],
                "PriceCurrencyName": "",
                "ValidityDate": res2['status'] != 'Open' ? res2['validityDate'] : '',
                "offerValidityDate": res2['validityDate'],
                "Status": res2['status'],
                "typeStatus" : 'Inquired',
                'rfqStatus' : res2['status'] != 'Open' ? true : false,
                "M1": '',
                "M2": '',
                "M3": '',
                "M4": '',
                "M5": '',
                "M6": '',
                "Q1": '',
                "Q2": '',
                "Q3": '',
                "Q4": '',
                "fdProduct": "",
                "fdTotalContractAmt": "",
                "fdFomulaDesc": "",
                "fdSchedule": "",
                "fdPremium": "",
                "fdAddCosts": "",
                "fdRemarks": "",
                "createdById": res2['createdById'],
                "createdOn": res2['createdOn'],
                "pricingTypeId": res2['pricingTypeId'],
                "lastEvaluationDate": res2['lastEvaluationDate'],
                "forwardPrices": res2['forwardPrices'],
                "isNoQuote": res2['isNoQuote'],
                "statusId": res2['statusId'],
                "lastModifiedById": res2['lastModifiedById'],
                "lastModifiedOn": res2['lastModifiedOn'],
                "contractRequestProductId" : res1['id'],
                "contractRequestId": response['id'],
                "contractRequestProductOfferIds" : res2['contractRequestProductOfferIds']??''
            }
            data.push(arrDet);
            arrDet = {};
        });
        let contractualQuantityOption = this.masterData['Uom'].find(el => el.id == res1['maxQuantityUomId']);
            arrMainDet = {
            'data' : data,
            "location-name": location.name,
            "location-id": res1['locationId'],
            "port-id": "1",
            "period": "M",
            "productId" : res1['productId'],
            "productName" : mainProduct.name,
            "specGroupId" : res1['specGroupId'],
            "minQuantity" : res1['minQuantity'],
            "maxQuantity" : res1['maxQuantity'],
            "pricingTypeId": res1['pricingTypeId'],
            "contractualQuantityOption" : contractualQuantityOption.name,
            "contractRequestProductId" : res1['id'],
            "pricingComment": res1['pricingComment'],
            "statusId": res1['statusId'],
            "status": res1['status'],
            "createdById": res1['createdById'],
            "createdOn": res1['createdOn'],
            "lastModifiedById": res1['lastModifiedById'],
            "lastModifiedOn": res1['lastModifiedOn'],
            "allowedLocations": res1['allowedLocations'],
            "allowedProducts": res1['allowedProducts'],
            "isDeleted": res1['isDeleted'],
            "maxQuantityUomId" : response['contractRequestProducts'][0]['maxQuantityUomId']
            }
            contractArray['locations'].push(arrMainDet);
            arrMainDet = {}; data = [];
        });
        let unique = [...new Set(uniqueLocations)];
        this.uniqueLocations = unique.toString();
        this.allRequestDetails = contractArray;
        this.store.dispatch(new ContractRequest([contractArray]));
    }

}
