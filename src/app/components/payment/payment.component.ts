import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator, Validators } from "@angular/forms"
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreditService } from 'src/app/services/credit.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  creditAddForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private creditService: CreditService,
    private rentService: RentalService,
    private toastrService: ToastrService,
    private route: Router,
    private renderer: Renderer2,
    private readonly elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.createCardAddForm()
    
  }

  createCardAddForm() {
    this.creditAddForm = this.formBuilder.group({
      cardNumber: ["", Validators.required],
      password: ["", Validators.required],
      cvv: ["", Validators.required],
      expiryDate: ["", Validators.required]
    })
    this.load()
  }

  load(){
    console.log("working")
    const script = this.renderer.createElement('script');
    script.src = 'assets/dist/js/payment.js';
    script.onload = () => {
      console.log('script loaded');

    }
    this.renderer.appendChild(document.querySelector("body"), script);
  }

  pay() {
    console.log(this.creditAddForm.value)
    let exp = new Date()

    if (this.creditAddForm.valid == false) {
      let cardModule = Object.assign({}, this.creditAddForm.value)
      let rentModule = Object.assign({}, this.rentService.rent)

      if (cardModule.expiryDate.length >= 6) {
        cardModule.expiryDate = cardModule.expiryDate.slice(0, -1)
      }
      var lastTwo = cardModule.expiryDate.substr(cardModule.expiryDate.length - 2)
      lastTwo = parseInt(lastTwo)
      exp.setFullYear(lastTwo + 2000)
      var firstTwo = cardModule.expiryDate.substr(0, 2)
      exp.setMonth(firstTwo)
      console.log(exp)
      if (exp > new Date()) {
        this.rentService.addRental(rentModule).subscribe(response => {
          this.toastrService.info(response.message, "Sistem")
          this.toastrService.success("Ödeme Başarılı", "Başarı")
          this.route.navigate([""])
        })
      } else {
        this.toastrService.error("Son Kullanım Tarihi Geçersiz")
      }


    } else {
      this.toastrService.error("Bilgilerinizi doğru girdiğinizden emin olun", "Hata")
    }
  }

}


