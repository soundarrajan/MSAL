import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AdalService } from 'adal-angular4';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private toastr: ToastrService, private adal: AdalService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(!this.adal.userInfo.authenticated) {
      this.toastr.warning('You are not authorized, redirecting')
      this.adal.login();
    }
    return this.adal.userInfo.authenticated;
  }
}
