import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Rental } from 'src/app/models/rental';
import { User } from 'src/app/models/user';
import { UserForUpdateDto } from 'src/app/models/userForUpdateDto';
import { AuthService } from 'src/app/services/auth.service';
import { RentalService } from 'src/app/services/rental.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User
  userId: number
  rentals: Rental[]
  roles: any
  isArray: boolean = false
  dataLoaded: boolean = false
  hasRental: boolean = false
  updateUserForm: FormGroup
  userForUpdateDto: UserForUpdateDto
  userTag:string = "User"

  tagClass:string ="text-muted text-center"

  constructor(
    private rentalService: RentalService,
    private userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['userId'])
      this.getUserById()
      this.getRentalsByUserId()
    })
  }

  createUpdateUserForm() {
    this.updateUserForm = this.formBuilder.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      email: [this.user.email],
      currentPassword: ["",Validators.required],
      newPassword: [""]
    })
  }

  getRentalsByUserId() {
    this.rentalService.getRentalByUserId(this.userId).subscribe(response => {
      this.rentals = response.data
      this.dataLoaded = true
      this.hasRental = true
    }, responseErr => {
      this.toastrService.info("Kullanıcı Henüz Araç Kiralamadı", "System")
      this.dataLoaded = true


    })
  }

  getUserById() {
    this.userService.getUserById(this.userId).subscribe(response => {
      this.user = response.data
      this.getUserClaims()
      this.createUpdateUserForm()
    })
  }

  getUserClaims() {
    this.userService.getUserClaims(this.user).subscribe(response=>{
      this.roles= response
      console.log(this.roles)
      if (typeof this.roles == 'object') {

        console.log("in")
        for (let i = 0; i < this.roles.length; i++) {
          this.isArray = true
          if (this.roles[i].name =="admin") {
            this.userTag = "Admin";this.tagClass="text-center text-bold text-danger"
          }
        }
      }
      console.log(this.isArray)
    })
    
    
    
  }

  change() {
    var containerElement = document.getElementById("currentPasswordDiv")
    containerElement.style.display = "flex"
  }

  cancel() {
    var containerElement = document.getElementById("currentPasswordDiv")
    containerElement.style.display = "none"
  }

  update() {
    console.log(this.updateUserForm.value)
    if (this.updateUserForm.valid) {
      let updateModel = Object.assign({}, this.updateUserForm.value)
      updateModel.id = this.user.id
      console.log(updateModel)
      this.userService.updateUser(updateModel).subscribe(response => {
        this.toastrService.success(response.message, "Success")
        this.userService.getUserById(this.userId).subscribe(response => {
          this.user = response.data
        })
      },responseErr=>{
        this.toastrService.error(responseErr.error.message,"Hata")
      })
    } else {
      this.toastrService.error("Form Is Missing", "Error")
    }
  }

  deleteUser(){
    this.userService.deleteUser(this.user).subscribe(response=>{
      this.router.navigate(["/admin/users/"]).then(()=>{
        this.toastrService.info(response.message,"System")
      })
    },responseErr=>{this.toastrService.error(responseErr.error.message,"Hata")})
  }

}
