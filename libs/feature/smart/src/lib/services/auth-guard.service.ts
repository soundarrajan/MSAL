import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGaurdService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('in active');
    var islogin = sessionStorage.getItem('userlogin');
    if (islogin == 'true') return true;

    this.router.navigate(['/login']);
    return false;
  }
}
