import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
})
export class NaviComponent implements OnInit {
  user: User;
  dataLoaded: boolean = false;
  authenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getUser(this.authService.getUserIdByJwt());
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
}
