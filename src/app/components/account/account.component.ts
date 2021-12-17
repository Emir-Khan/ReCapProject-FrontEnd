import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import {FormGroup,FormBuilder, Validators} from "@angular/forms"
import { Rental } from 'src/app/models/rental';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  updateUserForm: FormGroup
  user:User
  dataLoaded: boolean = false
  hasRental: boolean = false
  rentals: Rental[]

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private toastrService:ToastrService,
    private formBuilder:FormBuilder,
    private rentalService:RentalService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(){
    var userId= this.authService.getUserIdByJwt()
    this.userService.getUserById(userId).subscribe(response=>{
      this.user=response.data
      this.createUserUpdateForm();
      this.getRentalsByUserId()
    }) 
  }

  changeClass(){
    let element = document.getElementsByClassName('input-group-text') as HTMLCollectionOf<HTMLElement>
      element[0].setAttribute("disabled","")
  }

  getRentalsByUserId() {
    this.rentalService.getRentalByUserId(this.user.id).subscribe(async response => {
      this.rentals = response.data
      this.hasRental = true
      await setInterval(()=>{
        this.dataLoaded=true
      },1000)
    }, responseErr => {
      this.dataLoaded = true
      this.toastrService.info("Kullanıcı Henüz Araç Kiralamadı", "System")
    })
  }

  createUserUpdateForm(){
     this.updateUserForm = this.formBuilder.group({ 
      firstName:[this.user.firstName,Validators.required],
      lastName:[this.user.lastName,Validators.required],
      email:[this.user.email,Validators.required],
      currentPassword:[""],
      newPassword:[""]
    })
  }
  
  save(){
    if(this.updateUserForm.valid){
      let userModule = Object.assign({},this.updateUserForm.value)
      this.authService.updateUser(userModule).subscribe(response=>{
        this.toastrService.success("Bilgiler Güncellendi","Bilgi")
      },responseError=>{
        this.toastrService.error(responseError.error.message,"System")
      })
    }
  }

  change() {
    var containerElement = document.getElementById("currentPasswordDiv")
    containerElement.style.display = "flex"
  }

  cancel() {
    var containerElement = document.getElementById("currentPasswordDiv")
    containerElement.style.display = "none"
  }
}