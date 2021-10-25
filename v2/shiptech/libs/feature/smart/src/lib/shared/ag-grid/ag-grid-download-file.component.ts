import { Component,Inject } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { LocalService } from '../../services/local-service.service';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { FileSaverService } from 'ngx-filesaver';
import { DOCUMENTS_API_SERVICE } from '@shiptech/core/services/masters-api/documents-api.service';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';

@Component({
    selector: 'ag-grid-download-file',
    template: `
    <div class="text-center">
    <i (click)="downloadDocument(params.data)" aria-hidden="true">{{params.value}}</i>
  </div>
    `
})
export class AGGridDownloadFileComponent implements ICellRendererAngularComp  {
    public params: any;
    public shiptechUrl: string ;
    public data;
    public menuData;
    //public etaDays: any;
    public etaInTime: any;
    //public etdDays: any;
    public theme:boolean = true;
    public etdInTime: any;
    public shiptechPortUrl: string;
	constructor(public router: Router, private localService:LocalService,  private _FileSaverService: FileSaverService,
        @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
        private appErrorHandler: AppErrorHandler) {    
        this.shiptechUrl =  new URL(window.location.href).origin;;
        this.shiptechPortUrl = `${this.shiptechUrl}/#/masters/locations/edit/`;
    }        
	
    agInit(params: any): void {
        this.params = params;
        console.log("000000000000000000", this.params)
       
        this.menuData = params.value;
    }
    ngOnInit() {
        this.localService.themeChange.subscribe(value => this.theme = value);
      }
      Click(): void {
        
    }

    downloadDocument(param: any): void {
        console.log("000000000000000000", this.params)
        const request = {
          Payload: { Id: param.bdnFileID , name: param.bdnFileName}
        };
        this.mastersApi.downloadDocument(request).subscribe(
          response => {
            console.log("000000000000000000 response", this.params)
            this._FileSaverService.save(response, param.bdnFileName);
          },
          () => {
            this.appErrorHandler.handleError(ModuleError.DocumentDownloadError);
          }
        );
    }

    refresh(): boolean {
        return false;
    }
} 