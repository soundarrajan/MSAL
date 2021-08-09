import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { LocalService } from './local-service.service';
import { MapViewService } from './map-view.service';

@Injectable({
  providedIn: 'root'
})
export class VesselListRouteResolverService  implements Resolve<any> {
  isLoading: boolean;
  options: any;
  vesselList: any[];
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private localService: LocalService,
    private mapViewService: MapViewService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any{
    return new Promise(resolve => {
      let vesselModel = {
        code: "",
        databaseValue: 0,
        description: null,
        displayName: "",
        id: 0,
        imono: "",
        internalName: null,
        motProductTypeId: null,
        name: "",
        productTypeId: 0,
        transactionTypeId: 0
      }
      this.localService.getVesselListImono(false).subscribe((tenantConfRes)=> {
      console.log('tenantConfRes for vessel imono',tenantConfRes);
      tenantConfRes = tenantConfRes.items
      // this.localService.getVesselList(false).subscribe((data)=> {
      this.mapViewService.getVesselsListForMap(false).subscribe((vesselLists)=> {
        vesselLists = vesselLists.payload;
        this.vesselList = [];
        vesselLists.forEach(vesselItem=> {
          let vesselSchema = Object.assign({}, vesselModel);
          vesselSchema.code = (vesselItem.vesselCode).trim();
          vesselSchema.id = vesselItem.vesselId;
          vesselSchema.name = vesselItem.vesselName;
          vesselSchema.displayName = vesselItem.vesselName;
          this.vesselList.push(vesselSchema);
        })
        this.vesselList = this.vesselList.map(vesselItem=> {
          let obj = tenantConfRes.find(imoItem => imoItem.id === vesselItem.id);
          return obj ? {...vesselItem, imono:obj.name }: false;
        })
        console.log(this.vesselList);
        resolve(this.vesselList);

      })

    })
  })
  }

}
