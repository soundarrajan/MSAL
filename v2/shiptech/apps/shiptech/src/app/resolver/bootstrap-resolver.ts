import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BootstrapService } from '@shiptech/core/bootstrap.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BootstrapResolver implements Resolve<any> {
  constructor(private bootstrapService: BootstrapService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.bootstrapService.initApp().toPromise();
  }
}
