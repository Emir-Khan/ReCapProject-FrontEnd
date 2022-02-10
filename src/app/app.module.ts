import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { JwtModule } from "@auth0/angular-jwt"
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarComponent } from './components/car/car.component';
import { BrandComponent } from './components/brand/brand.component';
import { UserComponent } from './components/admin-operations/user/user.component';
import { NaviComponent } from './components/navi/navi.component';
import { RentalComponent } from './components/rental/rental.component';
import { ColorComponent } from './components/color/color.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';

import { ToastrModule } from "ngx-toastr";
import { CarFilterPipe } from './pipes/car-filter.pipe';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { CarImagesComponent } from './components/car-images/car-images.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { CarAddComponent } from './components/admin-operations/car-add/car-add.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './components/register/register.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AccountComponent } from './components/account/account.component';
import { AdminBrandComponent } from './components/admin-operations/admin-brand/admin-brand.component';
import { AdminColorComponent } from './components/admin-operations/admin-color/admin-color.component';
import { BrandsColorsComponent } from './components/admin-operations/brands-colors/brands-colors.component';
import { RentalCardComponent } from './components/rental-card/rental-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UsersComponent } from './components/admin-operations/users/users.component';
import { UserDetailsComponent } from './components/admin-operations/user-details/user-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { HasImagePipe } from './pipes/has-image.pipe';
import { SupportChatComponent } from './components/support-chat/support-chat.component';
const config : SocketIoConfig= {url:"http://localhost:8002"}

export function tokenGetter() {
  return localStorage.getItem("token")
}



@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    BrandComponent,
    UserComponent,
    NaviComponent,
    RentalComponent,
    ColorComponent,
    FilterPipePipe,
    CarFilterPipe,
    SideBarComponent,
    CarImagesComponent,
    CarDetailsComponent,
    CarAddComponent,
    LoginComponent,
    RegisterComponent,
    SpinnerComponent,
    PaymentComponent,
    AccountComponent,
    AdminBrandComponent,
    AdminColorComponent,
    BrandsColorsComponent,
    RentalCardComponent,
    FooterComponent,
    AdminPanelComponent,
    UsersComponent,
    UserDetailsComponent,
    HasImagePipe,
    SupportChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule,

    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,

    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule,

    SocketIoModule.forRoot(config),
    ToastrModule.forRoot({ positionClass: "toast-bottom-right" }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200", "localhost:44358"]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
