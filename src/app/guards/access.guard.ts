import { Injectable, Inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):| Observable<boolean | UrlTree>| Promise<boolean | UrlTree>| boolean| UrlTree {
    var role = this.jwtHelper.decodeToken(localStorage.getItem('token'))[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];
    console.log('Yetkiler: ' + role);

    // If role is an array
    if (typeof role=="object") {
      for (let i = 0; i < role.length; i++) {
        if (role[i] == 'admin' || role[i] == 'car.add') {
          return true;
        }
      }
    }

    // If role is an string
    if (role == 'admin' || role == 'car.add') {
      return true;
    }

    this.toastr.error('Yetersiz yetki', 'Erişim reddedildi');
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['']));
    return false;
  }
}
