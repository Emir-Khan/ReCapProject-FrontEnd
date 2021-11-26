import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AdminBrandComponent } from './components/admin-operations/admin-brand/admin-brand.component';
import { AdminColorComponent } from './components/admin-operations/admin-color/admin-color.component';
import { BrandsColorsComponent } from './components/admin-operations/brands-colors/brands-colors.component';
import { CarAddComponent } from './components/admin-operations/car-add/car-add.component';
import { BrandComponent } from './components/brand/brand.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { CarImagesComponent } from './components/car-images/car-images.component';
import { CarComponent } from './components/car/car.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentComponent } from './components/payment/payment.component';
import { RegisterComponent } from './components/register/register.component';
import { RentalComponent } from './components/rental/rental.component';
import { UserComponent } from './components/user/user.component';
import { AccessGuard } from './guards/access.guard';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [
  {path:"",pathMatch:"full",component:CarComponent},
  {path:"home",component:CarComponent},

  {path:"users",component:UserComponent},
  {path:"account",component:AccountComponent},
  {path:"rentals",component:RentalComponent},
  {path:"cars/search/color/:colorId",component:CarComponent},
  {path:"cars/search/brand/:brandId",component:CarComponent},
  {path:"cars/search/color/:colorId/brand/:brandId",component:CarComponent},
  {path:"cars/search/brand/:brandId/color/:colorId",component:CarComponent},
  {path:"carimage",component:CarImagesComponent},
  {path:"cars/:carId", component:CarDetailsComponent},

  {path:"admin/cars",component:CarAddComponent, canActivate:[LoginGuard,AccessGuard]},
  {path:"admin/brands-colors",component:BrandsColorsComponent, canActivate:[LoginGuard,AccessGuard]},

  {path:"cars/:carId/payment",component:PaymentComponent},

  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
