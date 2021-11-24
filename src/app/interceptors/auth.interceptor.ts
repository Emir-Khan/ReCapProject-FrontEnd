import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private toastrService:ToastrService,private router:Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    let token = localStorage.getItem("token")
    let newRequest : HttpRequest<any>
    newRequest = request.clone({
      headers :request.headers.set("Authorization","Bearer "+token)
    })


    let expTime = this.authService.isTokenExpired()
    if (new Date().getTime()/1000>expTime && this.authService.isAuthenticated()) {
      this.authService.logOut()
      this.toastrService.info("Oturum Kapatılıyor...")
      this.toastrService.info('Oturum Süreniz Doldu', 'Sistem');
      this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['login']));
    }

    return next.handle(newRequest);

  }
}
