import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSalesComponent } from './product-sales.component';

describe('ProductSalesComponent', () => {
  let component: ProductSalesComponent;
  let fixture: ComponentFixture<ProductSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
