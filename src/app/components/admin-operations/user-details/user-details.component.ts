import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rental } from 'src/app/models/rental';
import { User } from 'src/app/models/user';
import { RentalService } from 'src/app/services/rental.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user:User
  userId:number
  rentals:Rental[]

  constructor(
    private rentalService:RentalService,
    private userService:UserService,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.userId = params['userId']
      this.getUserById()
      this.getRentalsByUserId()
    })
  }

  getRentalsByUserId() {
    this.rentalService.getRentalByUserId(this.userId).subscribe(response => {
      this.rentals = response.data
    })
  }

  getUserById(){
    this.userService.getUserById(this.userId).subscribe(response=>{
      this.user=response.data
    })
  }

}
