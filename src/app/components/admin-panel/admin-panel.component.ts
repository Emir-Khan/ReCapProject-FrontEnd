import { Component, OnInit, Renderer2 } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { Rental } from 'src/app/models/rental';
import { User } from 'src/app/models/user';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { RentalService } from 'src/app/services/rental.service';
import { UserService } from 'src/app/services/user.service';
declare var startsth: any

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  cars: Car[]
  users: User[]
  rentals: Rental[]
  brands: Brand[]
  colors: Color[]

  constructor(
    private renderer: Renderer2,
    private carService: CarService,
    private userService: UserService,
    private retnalService: RentalService,
    private colorService: ColorService,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.getCars()
    this.getUsers()
    this.getRentals()
    this.getBrands()
    this.getColors()
  }

  load() {
    console.log("working")
    const script = this.renderer.createElement('script');
    script.src = 'assets/dist/js/demo.js';
    script.onload = () => {
      console.log('script loaded');

    }
    this.renderer.appendChild(document.querySelector("body"), script);
  }

  getCars() {
    this.carService.getCars().subscribe(response => {
      this.cars = response.data
    })
  }

  getUsers() {
    this.userService.getUsers().subscribe(response => {
      this.users = response.data
    })
  }

  getRentals() {
    this.retnalService.getRentals().subscribe(response => {
      this.rentals = response.data
    })
  }

  getColors() {
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data
      console.log()
      startsth(this.rentals)
      this.load()
    })
  }

  getBrands() {
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data
    })
  }

  startsth(getedRentals:Rental[]) {
    new startsth(getedRentals)
  }

}
