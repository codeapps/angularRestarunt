import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCorrectionComponent } from './product-correction.component';

describe('ProductCorrectionComponent', () => {
  let component: ProductCorrectionComponent;
  let fixture: ComponentFixture<ProductCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
