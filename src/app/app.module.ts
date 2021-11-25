import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import {FormsModule,ReactiveFormsModule} from "@angular/forms"
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import {JwtModule} from "@auth0/angular-jwt"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarComponent } from './components/car/car.component';
import { BrandComponent } from './components/brand/brand.component';
import { UserComponent } from './components/user/user.component';
import { NaviComponent } from './components/navi/navi.component';
import { RentalComponent } from './components/rental/rental.component';
import { ColorComponent } from './components/color/color.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';

import {ToastrModule} from "ngx-toastr";
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



export function tokenGetter(){
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
    RentalCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({positionClass:"toast-bottom-right"}),
    JwtModule.forRoot({
      config:{
        tokenGetter:tokenGetter,
        allowedDomains:["localhost:4200","localhost:44358"]
      }
    })
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
