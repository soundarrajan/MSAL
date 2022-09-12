import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.userInfo.authenticated) {
      this.toastr.warning('You are not authorized, redirecting');

      // Note: using timeout to give user some time to read the toaster
      setTimeout(() => {
        this.authService.login();
      }, 2000);
    }
    return this.authService.userInfo.authenticated;
  }
}
