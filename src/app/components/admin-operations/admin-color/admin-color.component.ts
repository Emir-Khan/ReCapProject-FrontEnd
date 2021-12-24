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
  colorUpdateForm:FormGroup
  colors: Color[];

  colorSelect:number = -1
  colorNameText:string =""
  colorIdText:number

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createColorAddForm();
    this.createColorDeleteForm();
    this.createColorUpdateForm()
    this.getColors();
  }

  createColorDeleteForm() {
    this.colorDeleteForm = this.formBuilder.group({
      colorId: ['', Validators.required],
    });
  }

  createColorUpdateForm() {
    this.colorUpdateForm = this.formBuilder.group({
      colorName: [this.colorNameText, Validators.required],
      colorId: [this.colorIdText]
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

  changeTexts(){
    let data = this.colors.find(b => b.colorId == this.colorSelect)
    this.colorIdText = data.colorId
    this.colorNameText = data.colorName
    this.createColorUpdateForm()
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

  updateColor(){
    if (this.colorUpdateForm.valid) {
      let updateModule = Object.assign({},this.colorUpdateForm.value)
      this.colorService.updateColor(updateModule).subscribe(response=>{
        this.toastrService.info(response.message,"Sistem")
        for (let i = 0; i < this.colors.length; i++) {
          if (this.colors[i].colorId ==updateModule.colorId) {
            this.colors[i] = updateModule
            this.colorSelect = this.colors[i].colorId
          } 
        }
      },responseError=>{
        this.toastrService.error(responseError.message,"Error")
      })
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
