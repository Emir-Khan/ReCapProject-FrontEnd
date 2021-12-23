import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as Aos from 'aos';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
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
  updateCarForm: FormGroup
  deleteImageForm: FormGroup
  selectedFile: File

  carSelect: number = -1

  imageSrc: any = "../../../../assets/img/car-image-add-default.png"

  cars: Car[];
  brands: Brand[];
  colors: Color[];

  firstBrand: Brand

  carNameText: string = ""
  modelYearText: number
  descriptionText: string = ""
  dailyPriceText: number
  brandSelect: number = -1
  colorSelect: number = -1
  carIdText: number
  dataLoaded: boolean = false

  constructor(
    private brandService: BrandService,
    private colorService: ColorService,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private toastService: ToastrService,
    private httpClient: HttpClient,
    private carImageService: CarImageService
  ) { }

  ngOnInit(): void {
    this.createCarAddForm();
    this.createDeleteCarForm();
    this.createCarImageAddForm();
    this.createDeleteImageForm();

    this.getCars()
    this.getBrands()
    this.getColors()
    this.dataLoaded = true
    this.createUpdateCarForm()
  }

  createCarImageAddForm() {
    this.addCarImageForm = this.formBuilder.group({
      carId: [-1, Validators.required]
    })
  }

  createDeleteCarForm() {
    this.deleteCarForm = this.formBuilder.group({
      carId: ['', Validators.required]
    })
  }
  createUpdateCarForm() {
    this.updateCarForm = this.formBuilder.group({
      carId: [this.carIdText, Validators.required],
      brandId: [this.brandSelect, Validators.required],
      colorId: [this.colorSelect, Validators.required],
      carName: [this.carNameText, Validators.required],
      modelYear: [this.modelYearText, Validators.required],
      dailyPrice: [this.dailyPriceText, Validators.required],
      description: [this.descriptionText, Validators.required]
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

  createDeleteImageForm() {
    this.deleteImageForm = this.formBuilder.group({
      carId: ['', Validators.required]
    })
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
        this.getCars()
      })
    } else {
      this.toastService.error("Formunuz Eksik", "Hata")
    }

  }

  getCars() {
    this.carService.getCarsDetails().subscribe((response) => {
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

  changeTexts() {
    console.log(this.carSelect)

    let data = this.cars.find(i => i.carId == this.carSelect)

    this.carNameText = data.carName
    this.modelYearText = data.modelYear
    this.descriptionText = data.description
    this.dailyPriceText = data.dailyPrice
    this.brandSelect = data.brandId
    this.colorSelect = data.colorId
    this.carIdText = data.carId
    console.log(this.carNameText +
      this.modelYearText +
      this.descriptionText +
      this.dailyPriceText + "d " +
      this.brandSelect + "b " +
      this.colorSelect + "c " +
      this.carIdText + " cid")
    this.createUpdateCarForm()
  }

  updateCar() {
    console.log(this.carNameText +
      this.modelYearText +
      this.descriptionText +
      this.dailyPriceText + "d " +
      this.brandSelect + "b " +
      this.colorSelect + "c " +
      this.carIdText + " cid")
    console.log(this.updateCarForm.value)
    if (this.updateCarForm.valid) {
      let updateModule = Object.assign({}, this.updateCarForm.value)
      updateModule.brandId = new Number(updateModule.brandId)
      updateModule.colorId = new Number(updateModule.colorId)
      this.carService.updateCar(updateModule).subscribe(response => {
        this.toastService.success(response.message, "Başarılı")
        this.getCars()
      })
    } else {
      this.toastService.error("Formunuz Ekisk", "Hata")
    }
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
        this.getCars()
      }, responseErr => {
        this.toastService.error("Girdiğiniz Araba Adı kullanımda", "Hata")
      });
    } else {
      this.toastService.error('Formunuz Eksik', 'Hata');
    }
  }

  deleteCar() {
    if (this.deleteCarForm.valid) {
      let deleteModule = Object.assign({}, this.deleteCarForm.value)
      this.carService.deleteCar(deleteModule).subscribe(response => {
        this.toastService.success(response.message, "İşlem Başarılı")
      })
      this.carImageService.deleteImage(deleteModule.carId).subscribe(response => {
        this.toastService.info(response.message, "Sistem")
        this.getCars()
      })
    } else {
      this.toastService.error("Formunuz Eksik", "Hata")
    }
  }

  deleteImage() {
    if (this.deleteImageForm.valid) {
      let deleteModule = Object.assign({}, this.deleteImageForm.value)
      this.carImageService.getCarImageByCarId(deleteModule.carId).subscribe(response => {
        console.log(response)
        this.carImageService.deleteImage(response.data).subscribe(response => {
          this.toastService.info(response.message, "Sistem")
          this.getCars()
        })
      })
    } else {
      this.toastService.error("Formunuz Eksik", "Hata")
    }
  }

}