import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { LocalService } from './local-service.service';

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
    private localService: LocalService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any{
    return new Promise(resolve => {
      this.localService.getVesselListImono(false).subscribe((tenantConfRes)=> {
      console.log('tenantConfRes for vessel imono',tenantConfRes);
      tenantConfRes = tenantConfRes.items
      this.localService.getVesselList(false).subscribe((data)=> {
        console.log('getVesselList',data);
        let vesselRes = data;
        this.vesselList = [];
        this.vesselList = vesselRes.map(vesselItem=> {
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
