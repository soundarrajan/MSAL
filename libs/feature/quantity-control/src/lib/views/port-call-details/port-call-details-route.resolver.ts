import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { PortCallDetailsService } from '../../services/port-call-details.service';
import { ModuleError } from '../../core/error-handling/module-error';
import { KnownQuantityControlRoutes } from '../../known-quantity-control.routes';

@Injectable()
export class PortCallDetailsRouteResolver implements Resolve<any> {
  constructor(
    private portCallDetailsService: PortCallDetailsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const portCallIdParam = route.params[KnownQuantityControlRoutes.portCallIdParam];

    if (!portCallIdParam) {
      return throwError(ModuleError.InvalidPortCallId(portCallIdParam));
    }

    return this.portCallDetailsService.loadPortCallDetails(portCallIdParam);
  }
}
