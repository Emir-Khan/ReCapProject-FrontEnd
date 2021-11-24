import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css'],
})
export class CarAddComponent implements OnInit {
  carAddForm: FormGroup;
  deleteCarForm: FormGroup;
  addCarImageForm: FormGroup
  selectedFile: File

  imageSrc: any = "../../../../assets/img/car-image-add-default.png"

  cars: Car[];
  brands: Brand[];
  colors: Color[];

  firstBrand: Brand

  constructor(
    private brandService: BrandService,
    private colorService: ColorService,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private toastService: ToastrService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.createCarAddForm();
    this.createDeleteCarForm();
    this.createCarImageAddForm();
    this.getCars()
    this.getBrands()
    this.getColors()
  }

  createCarImageAddForm() {
    this.addCarImageForm = this.formBuilder.group({
      carId: ['', Validators.required]
    })
  }

  createDeleteCarForm() {
    this.deleteCarForm = this.formBuilder.group({
      carId: ['', Validators.required]
    })
  }

  createCarAddForm() {
    this.carAddForm = this.formBuilder.group({
      brandId: ['', Validators.required],
      colorId: ['', Validators.required],
      carName: ['', Validators.required],
      modelYear: ['', Validators.required],
      dailyPrice: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imageSrc = reader.result;
    }
  }

  onUpload() {
    if (this.addCarImageForm.value) {
      let carImageModule = Object.assign({}, this.addCarImageForm.value)
      const fd = new FormData()
      fd.append('image', this.selectedFile, this.selectedFile.name)
      console.log("tıklandı")
      this.httpClient.post(environment.baseUrl + "/carimages/add?CarId=" + carImageModule.carId, fd).subscribe(response => {
        this.toastService.info("Yüklendi", "Sistem")
      })
    } else {
      this.toastService.error("Formunuz Eksik", "Hata")
    }

  }

  getCars() {
    this.carService.getCars().subscribe((response) => {
      this.cars = response.data;
    });
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
      this.firstBrand = response.data[response.data.length - 3]
    });
  }

  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data;
    });
  }

  add() {
    console.log(this.carAddForm.value)
    if (this.carAddForm.valid) {
      let carModule = Object.assign({}, this.carAddForm.value);
      carModule.brandId = parseInt(carModule.brandId)
      carModule.colorId = parseInt(carModule.colorId)
      console.log(carModule.brandId)
      this.carService.addCar(carModule).subscribe((response) => {
        this.toastService.success(response.message, 'İşlem Başarılı');
      }, responseErr => {
        this.toastService.error(responseErr.err, "Hata")
      });
    } else {
      this.toastService.error('Formunuz Eksik', 'Hata');
    }
  }

  delete() {
    if (this.deleteCarForm.valid) {
      let deleteModule = Object.assign({}, this.deleteCarForm.value)
      deleteModule.carId = parseInt(deleteModule.carId)
      console.log(deleteModule)
      this.carService.deleteCar(deleteModule).subscribe(response => {
        this.toastService.success(response.message, "İşlem Başarılı")
      })
    }
  }

}
