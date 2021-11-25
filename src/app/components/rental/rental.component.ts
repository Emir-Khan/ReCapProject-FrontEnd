import { Component, OnInit } from '@angular/core';
import { CarImage } from 'src/app/models/carImage';
import { Rental } from 'src/app/models/rental';
import { AuthService } from 'src/app/services/auth.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  rentals: Rental[]
  carImage: CarImage
  hasRental: boolean = false

  filterText: string
  carImageUrl: string

  constructor(
    private brandService: RentalService,
    private carImageService: CarImageService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.brandService.getRentalByUserId(this.authService.getUserIdByJwt()).subscribe((response) => {
      console.log(response)
      this.rentals = response.data
      for (let i = 0; i < this.rentals.length; i++) {
        this.carImageService
          .getImagesByCarId(this.rentals[i].carId)
          .subscribe((response) => {
            this.carImage = response.data[0];
            this.carImageUrl = this.carImageService.getCarImageUrl(this.carImage.id)
          });

      }

    });
  }

}
