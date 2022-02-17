import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
 /*  animations:[
    
    trigger('fade', [
      transition("* => *", [
        query(".card", style({ opacity: 0, transform: "translateX(-100%)" })),
        query(".card",
          stagger("300ms", [
            animate("500ms", style({ transform: "translateX(0)",opacity: 1 }))
          ]))

      ])
    ])
  ] */
})
export class CarComponent implements OnInit {
  cars: Car[];
  filterText: string
  dataLoaded: boolean = false
  filtered:boolean = false

  constructor(private carService: CarService, private activatedRoute: ActivatedRoute,private messageService:MessageService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["colorId"] && params["brandId"]) {
        this.getCarsByFilter(params["colorId"], params["brandId"]);
      }
      else if (params["colorId"]) {
        this.getCarsByColor(params["colorId"])
      }
      else if (params["brandId"]) {
        this.getCarsByBrand(params["brandId"])
      }
      else {
        this.getCars();
      }
    })
  }

  getCars() {
    this.carService.getCarsDetails().subscribe((response) => {
      this.cars = response.data
      this.dataLoaded = true
    });
  }

  getCarsByFilter(colorId: number, brandId: number) {
    this.carService.getCarsByFilter(colorId, brandId).subscribe(response => {
      this.cars = response.data
      this.filtered = true
      this.dataLoaded = true
    })
  }

  getCarsByColor(colorId: number) {
    this.carService.getCarsByColor(colorId).subscribe(response => {
      this.cars = response.data
      this.dataLoaded = true
    })
  }

  getCarsByBrand(brandId: number) {
    this.carService.getCarsByBrand(brandId).subscribe(response => {
      this.cars = response.data
      this.dataLoaded = true
    })
  }

}
