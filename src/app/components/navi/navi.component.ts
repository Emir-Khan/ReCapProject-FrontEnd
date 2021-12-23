import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RentalService } from 'src/app/services/rental.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
  animations:[
    trigger('logo',[
      state('void',style({opacity:0})),
      transition("void=>*",[
        animate(800)
      ])
    ]),
  ]
})
export class NaviComponent implements OnInit {
  user: User;
  dataLoaded: boolean = false;
  authenticated: boolean = false;
  isAdmin: boolean = false

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private jwtHelper:JwtHelperService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getUser(this.authService.getUserIdByJwt());
      this.isAdmin = this.isUserAdmin()
    } else {
      this.dataLoaded = true;
    }
  }

  getUser(userId: number) {
    this.userService.getUserById(userId).subscribe((response) => {
      this.user = response.data;
      this.dataLoaded = true;
      this.authenticated = true;
    });
  }

  deleteToken() {
    if (this.authService.logOut()) {
      this.toastrService.info('Çıkış yapıldı', 'Sistem');
    } else {
      this.toastrService.info('Çıkış zaten yapılmış', 'Sistem');
    }
  }

  isUserAdmin() {
    var role= this.authService.getClaims()
    console.log(role)
    // If role is an array
    if (typeof role == "object") {
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
    return false
  }

}
