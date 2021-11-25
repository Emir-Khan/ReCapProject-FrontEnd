import { Component, Input, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { Rental } from 'src/app/models/rental';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-rental-card',
  templateUrl: './rental-card.component.html',
  styleUrls: ['./rental-card.component.css']
})
export class RentalCardComponent implements OnInit {
  @Input() rental: Rental
  carImage: CarImage
  carImageUrl: string
  car:Car
  dataLoaded:boolean

  constructor(
    private carImageService: CarImageService,
    private carService:CarService
    ) { }

  ngOnInit(): void {
    this.getCarById(this.rental.carId)
    this.getCarImage()
  }

  getCarImage() {
    this.carImageService
      .getImagesByCarId(this.rental.carId)
      .subscribe((response) => {
        this.carImage = response.data[0];
        this.carImageUrl = this.carImageService.getCarImageUrl(this.carImage.id)
        
      });
  }

  getCarById(carId:number){
    this.carService.getCarBySingleId(carId).subscribe(response=>{ 
      this.car = response.data
      this.dataLoaded = true
    })
  }

}
