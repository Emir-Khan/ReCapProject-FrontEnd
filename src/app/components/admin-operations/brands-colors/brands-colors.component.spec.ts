import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsColorsComponent } from './brands-colors.component';

describe('BrandsColorsComponent', () => {
  let component: BrandsColorsComponent;
  let fixture: ComponentFixture<BrandsColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
