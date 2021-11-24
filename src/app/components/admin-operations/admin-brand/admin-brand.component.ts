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
  brands: Brand[];

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createBrandAddForm();
    this.createBrandDeleteForm();
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

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
      console.log(response);
    });
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
          this.toastrService.error(responseErr.err, 'Hata');
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik', 'Hata');
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
          this.toastrService.error(responseErr.err, 'Hata');
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik', 'Hata');
    }
  }
}
