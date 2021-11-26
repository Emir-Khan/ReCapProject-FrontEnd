import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
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
export class RentalCardComponent implements OnInit, AfterContentInit {
  @Input() rental: Rental
  carImage: CarImage
  carImageUrl: string
  car: Car
  dataLoaded: boolean = false
  cardLoaded: boolean = false

  listItem: string = "list-group-item"
  textColor: string = "text-muted"
  badge: string = "badge"
  card: string = 'card mb-3'
  badgeText: string = 'New'

  constructor(
    private carImageService: CarImageService,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.getCarById(this.rental.carId)
    this.getCarImage()
  }

  ngAfterContentInit(): void {
    let returnDate = this.rental.returnDate
    let rentDate = this.rental.rentDate
    if ((new Date(rentDate).getTime() < new Date().getTime()) && new Date().getTime() < new Date(returnDate).getTime()) {
      this.card += ' text-white bg-warning'
      this.listItem += ' list-group-item-warning'
      this.textColor = 'text-white'
      this.badge += ' bg-warning'
      this.badgeText = 'In Use'
      console.log("Working")
      this.badgeText = 'In Use'
      this.cardLoaded = true
    } else if (new Date().getTime() > new Date(returnDate).getTime()) {
      this.card += ' text-white bg-danger'
      this.listItem += ' list-group-item-danger'
      this.textColor = 'text-white'
      this.badge += ' bg-danger'
      this.badgeText = 'Expired'
      this.cardLoaded = true
    } else if (new Date().getTime() < new Date(rentDate).getTime()) {
      this.badge += ' bg-success'
      this.listItem += ' list-group-item-primary'
      this.card += ' text-white bg-primary'
      this.textColor = 'text-white'
      this.badgeText = 'New'
      this.cardLoaded = true
    }
  }

  getCarImage() {
    this.carImageService
      .getImagesByCarId(this.rental.carId)
      .subscribe((response) => {
        this.carImage = response.data[0];
        this.carImageUrl = this.carImageService.getCarImageUrl(this.carImage.id)

      });
  }

  getCarById(carId: number) {
    this.carService.getCarBySingleId(carId).subscribe(response => {
      this.car = response.data
      this.dataLoaded = true
    })
  }

}
