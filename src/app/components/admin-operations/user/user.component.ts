import { Component, Input, OnInit } from '@angular/core';
import { Rental } from 'src/app/models/rental';
import { User } from 'src/app/models/user';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() user: User
  rentals: Rental[]

  constructor(
    private rentalService: RentalService
  ) { }

  ngOnInit(): void {

  }

  getRentalsByUserId() {
    this.rentalService.getRentalByUserId(this.user.id).subscribe(response => {
      this.rentals = response.data
    })
  }

}
