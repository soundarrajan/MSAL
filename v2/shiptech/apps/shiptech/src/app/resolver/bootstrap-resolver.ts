import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { BootstrapForMsalService } from '@shiptech/core/bootstrap-for-msal.service';

@Injectable({ providedIn: 'root' })
export class BootstrapResolver implements Resolve<any> {
  constructor(private bootstrapService: BootstrapForMsalService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.bootstrapService.initApp().toPromise();
  }
}
