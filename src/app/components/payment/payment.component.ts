import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Rental } from 'src/app/models/rental';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  creditAddForm: FormGroup
  rental: Rental

  constructor(
    private formBuilder: FormBuilder,
    private rentService: RentalService,
    private toastrService: ToastrService,
    private route: Router,
    private renderer: Renderer2
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

  load() {
    console.log("working")
    const script = this.renderer.createElement('script');
    script.src = 'assets/dist/js/payment.js';
    script.id = 'paymentScript'
    script.name = Math.floor(Math.random() * 1000) + 1
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
          this.route.navigate([''])
            .then(() => {
              window.location.reload();
            });
            
        }, responseErr => {
          this.toastrService.error(responseErr.err, "Hata")
        })
      } else {
        this.toastrService.error("Son Kullanım Tarihi Geçersiz")
      }


    } else {
      this.toastrService.error("Bilgilerinizi doğru girdiğinizden emin olun", "Hata")
    }
  }

}


