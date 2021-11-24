import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent implements OnInit {
  brands:Brand[]=[]
  currentBrandId:number
  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.brandService.getBrands().subscribe((response) => {
      this.brands=response.data
    });
  }

  getCurrentBrandId(brand: Brand) {
    if (brand.brandId == this.currentBrandId) {
      console.log(this.currentBrandId)
      return true;
    } else {
      console.log(this.currentBrandId)
      return false;
    }
  }

  cleanCurrentBrandId() {
    if (this.currentBrandId) {
      return true;
    } else {
      return false;
    }
  }

  setRouterLink(){
    return "/cars/search/" + this.currentBrandId
  }
}
