import { Injectable } from '@angular/core';
// import { MongodbService } from 'inatech-shared-infrastructure';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class AppSettings {
  readonly configSettingsTagName = 'PlanningDashboardSettings';

  private baseUrl_;
  private bigDataServiceUrl_;
  private blobUrl_;
  private configApiUrl_;
  private defaultFuelStatus_;
  private mongoUrl_;
  private integrationApiUrl_;
  private integrationLocationUrl_;
  private integrationRequestUrl_;
  private integrationVesselUrl_;
  private planningDashboardApiUrl_;
  private priceHistoryofLocationUrl_;
  private supplierUrl_;
  private productIntegration_: boolean = false;
  private commentsHoverPos_: any;
  get baseUrl(): string {
    return this.baseUrl_;
  }

  set baseUrl(val: string) {
    this.baseUrl_ = this.baseUrl_ == undefined ? val : this.baseUrl_;
  }

  get bigDataServiceUrl(): string {
    return this.bigDataServiceUrl_;
  }

  set bigDataServiceUrl(val: string) {
    this.bigDataServiceUrl_ =
      this.bigDataServiceUrl_ == undefined ? val : this.bigDataServiceUrl_;
  }

  get blobUrl(): string {
    return this.blobUrl_;
  }

  set blobUrl(val) {
    this.blobUrl_ = this.blobUrl_ == undefined ? val : this.blobUrl_;
  }

  get configApiUrl(): string {
    return this.configApiUrl_;
  }

  set configApiUrl(val) {
    this.configApiUrl_ =
      this.configApiUrl_ == undefined ? val : this.configApiUrl_;
  }

  get defaultFuelStatus(): string {
    return this.defaultFuelStatus_;
  }

  set defaultFuelStatus(val) {
    this.defaultFuelStatus_ =
      this.defaultFuelStatus_ == undefined ? val : this.defaultFuelStatus_;
  }

  get commentsPadding(): any {
    return this.commentsHoverPos_;
  }

  set commentsPadding(val) {
    this.commentsHoverPos_ =
      this.commentsHoverPos_ == undefined ? val : this.commentsHoverPos_;
  }

  get mongoUrl(): string {
    return this.mongoUrl_;
  }

  set mongoUrl(value: string) {
    this.mongoUrl_ = this.mongoUrl_ == undefined ? value : this.mongoUrl_;
  }

  get integrationApiUrl(): string {
    return this.integrationApiUrl_;
  }

  set integrationApiUrl(value: string) {
    this.integrationApiUrl_ =
      this.integrationApiUrl_ == undefined ? value : this.integrationApiUrl_;
  }

  get integrationLocationUrl(): string {
    return this.integrationLocationUrl_;
  }

  set integrationLocationUrl(value: string) {
    this.integrationLocationUrl_ =
      this.integrationLocationUrl_ == undefined
        ? value
        : this.integrationLocationUrl_;
  }

  get integrationRequestUrl(): string {
    return this.integrationRequestUrl_;
  }

  set integrationRequestUrl(value: string) {
    this.integrationRequestUrl_ =
      this.integrationRequestUrl_ == undefined
        ? value
        : this.integrationRequestUrl_;
  }

  get integrationVesselUrl(): string {
    return this.integrationVesselUrl_;
  }

  set integrationVesselUrl(value: string) {
    this.integrationVesselUrl_ =
      this.integrationVesselUrl_ == undefined
        ? value
        : this.integrationVesselUrl_;
  }

  get planningDashboardApiUrl(): string {
    return this.planningDashboardApiUrl_;
  }

  set planningDashboardApiUrl(val: string) {
    this.planningDashboardApiUrl_ =
      this.planningDashboardApiUrl_ == undefined
        ? val
        : this.planningDashboardApiUrl_;
  }

  get priceHistoryofLocationUrl(): string {
    return this.priceHistoryofLocationUrl_;
  }

  set priceHistoryofLocationUrl(val: string) {
    this.priceHistoryofLocationUrl_ =
      this.priceHistoryofLocationUrl_ == undefined
        ? val
        : this.priceHistoryofLocationUrl_;
  }

  get supplierUrl(): string {
    return this.supplierUrl_;
  }

  set supplierUrl(val: string) {
    this.supplierUrl_ =
      this.supplierUrl_ == undefined ? val : this.supplierUrl_;
  }

  get productIntegration(): boolean {
    return this.productIntegration_;
  }

  set productIntegration(value: boolean) {
    this.productIntegration_ = value;
  }

  tenantId: any;

  userName: any;

  constructor(
    // private objMongoService:MongodbService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    if (this.mongoUrl == undefined) this.getAppSettings();

    this.tenantId =
      localStorage.getItem('TenantId') == undefined
        ? 4
        : localStorage.getItem('TenantId');

    this.userName =
      localStorage.getItem('userInfo') == undefined
        ? ''
        : localStorage.getItem('userInfo');

    // this.getAppSettings(tenantId, userName);
  }

  getSettingsJson(): Observable<any> {
    return Observable.create((observer: any) => {
      this.http.get('./assets/config/settings.json').subscribe(res => {
        if (res != undefined) {
          // this.mongoUrl=res["mongoUrl"];

          // this.objMongoService.apiUrl=this.mongoUrl;

          observer.next(res);
        }
      });
    });
  }

  getAppSettings(): Observable<any> {
    return Observable.create((observer: any) => {
      var queryString =
        'ConfigurationSettings?TenantId=' +
        this.tenantId +
        '&Tags=' +
        this.configSettingsTagName;

      // if(this.userName!=undefined && this.userName!="")
      // queryString=queryString + "&userName=" + this.userName;

      this.getSettingsJson().subscribe(res => {
        // this.objMongoService.apiUrl=this.mongoUrl= res["mongoUrl"];

        this.commentsPadding = res['CommentsHover_PaddingY'];

        //     this.objMongoService.GetNodeApiJson("GET", queryString).subscribe(settings => {
        //     if(settings==undefined || settings.length==0)
        //     {
        //         this.snackBar.open('ERROR in getting App settings', 'error', { duration: 2000, });

        //         return;

        //     }

        //     this.bigDataServiceUrl=(settings.find(setting=>setting.key=="bigDataServiceUrl")).value;

        //     this.blobUrl=settings.find(setting=>setting.key=="blobUrl").value;

        //     this.configApiUrl=settings.find(setting=>setting.key=="configApiUrl").value;

        //     this.defaultFuelStatus=settings.find(setting=>setting.key=="DefaultFuelStatus").value;

        //     this.integrationApiUrl=settings.find(setting=>setting.key=="integrationApiUrl").value;

        //     if(settings.find(setting=>setting.key=="ProductIntegration").value.toLowerCase()=="true")
        //     {
        //         this.productIntegration=true;

        //         this.integrationLocationUrl=settings.find(setting=>setting.key=="ProductIntegrationLocationUrl").value;

        //         this.integrationRequestUrl=settings.find(setting=>setting.key=="ProductIntegrationRequestUrl").value;

        //         this.integrationVesselUrl=settings.find(setting=>setting.key=="ProductIntegrationVesselUrl").value;

        //         this.priceHistoryofLocationUrl=settings.find(setting=>setting.key=="LocationPriceHistoryUrl").value;

        //         this.supplierUrl=settings.find(setting=>setting.key=="SupplierUrl").value;
        //     }

        //     this.planningDashboardApiUrl=settings.find(setting=>setting.key=="planningDashboardApiUrl").value;

        //     observer.next(this);

        //     observer.complete();

        // });
      });
    });
  }
}
