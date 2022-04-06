import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-admin-brand',
  templateUrl: './admin-brand.component.html',
  styleUrls: ['./admin-brand.component.css'],
})
export class AdminBrandComponent implements OnInit {
  brandAddForm: FormGroup;
  brandDeleteForm: FormGroup;
  brandUpdateForm: FormGroup
  brands: Brand[];

  brandNameText: string = ""
  brandIdText: number

  brandSelect: number = -1

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.createBrandAddForm();
    this.createBrandDeleteForm();
    this.createBrandUpdateForm()
    this.getBrands();

  }

  createBrandDeleteForm() {
    this.brandDeleteForm = this.formBuilder.group({
      brandId: ['', Validators.required],
    });
  }

  createBrandAddForm() {
    this.brandAddForm = this.formBuilder.group({
      brandName: ['', Validators.required],
    });
  }

  createBrandUpdateForm() {
    this.brandUpdateForm = this.formBuilder.group({
      brandName: [this.brandNameText, Validators.required],
      brandId: [this.brandIdText,Validators.required]
    });
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
    });
  }

  changeTexts() {
    let data = this.brands.find(b => b.brandId == this.brandSelect)
    this.brandIdText = data.brandId
    this.brandNameText = data.brandName
    this.createBrandUpdateForm()
  }

  addBrand() {
    if (this.brandAddForm.valid) {
      let brandModule = Object.assign({}, this.brandAddForm.value);
      this.brandService.addBrand(brandModule).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı');
          this.getBrands();
        },
        (responseErr) => {
          this.toastrService.error(responseErr.error.Errors[0].ErrorMessage);
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik', 'Hata');
    }
    
  }

  updateBrand() {
    if (this.brandUpdateForm.valid) {
      let updateModule = Object.assign({},this.brandUpdateForm.value)
      this.brandService.updateBrand(updateModule).subscribe(response=>{
        this.toastrService.info(response.message,"Sistem")
        for (let i = 0; i < this.brands.length; i++) {
          if (this.brands[i].brandId ==updateModule.brandId) {
            this.brands[i] = updateModule
            this.brandSelect = this.brands[i].brandId
          } 
        }
        
      },responseError=>{
        this.toastrService.error(responseError.message,"Error")
      })
    }else{
      this.toastrService.error("First Select a Brand","Error")
    }
  }

  deleteBrand() {
    if (this.brandDeleteForm.valid) {
      let brandModule = Object.assign({}, this.brandDeleteForm.value);
      this.brandService.deleteBrand(brandModule).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı');
          this.getBrands();
        },
        (responseErr) => {
          this.toastrService.error(responseErr.message, 'Hata');
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik', 'Hata');
    }
  }
}
