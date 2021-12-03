import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  cars: Car[]
  colors: Color[]
  brands: Brand[]
  colorId: number = -1
  brandId: number = -1

  constructor(
    private colorService: ColorService,
    private brandService: BrandService,
    private carService: CarService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getColors();
    this.getBrands();
    this.activatedRoute.params.subscribe(params => {
      if (params["colorId"] && params["brandId"]) {
        this.colorId = params['colorId']
        this.brandId = params['brandId']
      }
      else if (params["colorId"]) {
        this.colorId = params["colorId"]
        this.brandId = -1
      }
      else if (params["brandId"]) {
        this.brandId = params['brandId']
        this.colorId = -1
      }
      else {
        this.colorId = -1
        this.brandId = -1
      }
    })
  }

  getColors() {
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data
    })
  }

  getBrands() {
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data
    })
  }
  getFilterBtn(colorId: number, brandId: number) {
    this.carService.getCarsByFilter(colorId, brandId).subscribe(response => {
      this.cars = response.data
    })
  }

  setRouterLink(colorId: number, brandId: number) {
    if (colorId == -1 && brandId == -1) {
      return ""
    } else if (colorId == -1) {
      return "/cars/search/brand/" + brandId
    } else if (brandId == -1) {
      return "/cars/search/color/" + colorId
    } else {
      return "/cars/search/color/" + colorId + "/brand/" + brandId
    }

  }
}
