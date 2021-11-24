import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-admin-color',
  templateUrl: './admin-color.component.html',
  styleUrls: ['./admin-color.component.css'],
})
export class AdminColorComponent implements OnInit {
  colorAddForm: FormGroup;
  colorDeleteForm: FormGroup;
  colors: Color[];

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createColorAddForm();
    this.createColorDeleteForm();
    this.getColors();
  }

  createColorDeleteForm() {
    this.colorDeleteForm = this.formBuilder.group({
      colorId: ['', Validators.required],
    });
  }

  createColorAddForm() {
    this.colorAddForm = this.formBuilder.group({
      colorName: ['', Validators.required],
    });
  }

  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data;
    });
  }

  addColor() {
    if (this.colorAddForm.valid) {
      let colorModule = Object.assign({}, this.colorAddForm.value);
      this.colorService.addColor(colorModule).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı');
          this.getColors();
        },
        (responseErr) => {
          this.toastrService.error(responseErr.err, 'Hata');
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik', 'Hata');
    }
  }

  deleteColor() {
    if (this.colorDeleteForm.valid) {
      let deleteModule = Object.assign({}, this.colorDeleteForm.value);
      this.colorService.deleteColor(deleteModule).subscribe((response) => {
        this.getColors();
        this.toastrService.success(response.message, 'Renk Silindi');
      });
    } else {
      this.toastrService.error('Formunuz Eksik', 'Hata');
    }
  }
}
