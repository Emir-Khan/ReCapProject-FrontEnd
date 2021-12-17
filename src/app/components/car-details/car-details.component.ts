import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RentalService } from 'src/app/services/rental.service';
import { Rental } from 'src/app/models/rental';


@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {
  cars: Car[];
  rentals: Rental[]
  carImage: CarImage;
  carImageUrl: string;
  rentAddForm: FormGroup
  strUserId: string
  userId: number
  carID: number
  currentYear: number;
  index:number =0
  dates:Date[] =[]
  myFilter = (d: Date|null): boolean => {
    const date =d.getDate();
    let sortedDates= this.dates.sort((a:Date,b:Date)=> a.getTime()-b.getTime())

    console.log(date)
    console.log(new Date(sortedDates[this.index]).getDate())
    console.log(this.index)
      if (2021 == new Date(sortedDates[this.index]).getFullYear()) {
        console.log("if") 
        var responsedDate=sortedDates[this.index].getDate()==date? false:true;

        if(sortedDates[this.index].getDate()==date) this.index++
        if(sortedDates[sortedDates.length-1].getDate()==date) this.index =0
        return responsedDate
      }  

    return true
  }
  returnDateForm: FormGroup
  timeGroup: FormGroup

  constructor(
    private toastrService: ToastrService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private authService: AuthService,
    private rentalService: RentalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["carId"]) {
        this.getCarById(params["carId"]);
        this.getCarImage(params["carId"])
        this.createRentalAddFrom(params["carId"])
        this.getRentals()
      }
    })
  }

  public formGroup = new FormGroup({
    date2: new FormControl(null, [Validators.required]),
    date1: new FormControl(null, [Validators.required])
  })
  createRentalAddFrom(strcarId: string) {
    this.carID = +strcarId
    this.rentAddForm = this.formBuilder.group({
      carId: [this.carID, Validators.required],
      userId: [this.userId, Validators.required],
      rentDate: ["", Validators.required],
      returnDate: ["", Validators.required]
    })
  }

  getCarImage(carId: number) {
    this.carImageService
      .getImagesByCarId(carId)
      .subscribe((response) => {
        this.carImage = response.data[0];
        this.carImageUrl = this.carImageService.getCarImageUrl(
          this.carImage.id
        );
      });
    this.strUserId = this.authService.getUserIdByJwt()
    this.userId = +this.strUserId
    console.log(typeof this.userId)
  }

  getCarById(carId: number) {
    this.carService.getCarById(carId).subscribe(response => {
      this.cars = response.data
      console.log(response)
    })
  }

  getRentals(){
    this.rentalService.getRentals().subscribe(response=>{
      this.rentals= response.data
      this.findFilterDates()
    })
  }

  findFilterDates(){
    var carRentals =[]
    for (let i = 0; i < this.rentals.length; i++) {
      if (this.rentals[i].carId == this.carID) {
        carRentals.push(this.rentals[i])
      }
    }
    console.log(carRentals)
    for (let i = 0; i < carRentals.length; i++) {
      carRentals[i].rentDate = new Date(new Date(new Date(this.rentals[i].rentDate).setMinutes(0)).setHours(0))
      carRentals[i].returnDate = new Date(new Date(new Date(this.rentals[i].returnDate).setMinutes(0)).setHours(0))
      let rentDate = new Date(carRentals[i].rentDate)
      let returnDate = new Date(carRentals[i].returnDate)
      this.dates.push(carRentals[i].returnDate) 
      while (rentDate<returnDate) {
        console.log("in")
        this.dates.push(returnDate) 
        returnDate = new Date(returnDate.setHours(-24))
      }
     
    }
    console.log(this.dates)
  }

  rentalAdd() {
    if (this.authService.isAuthenticated()) {
      if (this.rentAddForm.valid) {
        var timeModule = Object.assign({}, this.formGroup.value)

        var time2 = timeModule.date2._d
        var time1 = timeModule.date1._d

        this.rentAddForm.value.rentDate = new Date(this.rentAddForm.value.rentDate.setHours(time2.getHours()))
        this.rentAddForm.value.rentDate = new Date(this.rentAddForm.value.rentDate.setMinutes(time2.getMinutes()))

        this.rentAddForm.value.returnDate = new Date(this.rentAddForm.value.returnDate.setHours(time1.getHours()))
        this.rentAddForm.value.returnDate = new Date(this.rentAddForm.value.returnDate.setMinutes(time1.getMinutes()))
        var rentModule = Object.assign({}, this.rentAddForm.value)

        console.log(rentModule)
        this.rentalService.isRentable(rentModule).subscribe(response => {
          this.toastrService.info("Ödeme bilgilerinizi giriniz", "Sistem")
          this.router.navigate(["cars/" + this.carID + "/payment"])
        }, responseError => {
          this.toastrService.error(responseError.error.message, "Hata")
        })
      } else {
        this.toastrService.error("Seçtiğiniz tarihler uygun değil", "Hata")
      }
    } else {
      this.toastrService.info("Araba Kiralamak İçin Giriş Yapın", "Giriş Yapılmadı")
      this.router.navigate(["login"])
    }
  }
}
