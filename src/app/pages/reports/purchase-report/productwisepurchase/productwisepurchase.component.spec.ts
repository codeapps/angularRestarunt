import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductwisepurchaseComponent } from './productwisepurchase.component';

describe('ProductwisepurchaseComponent', () => {
  let component: ProductwisepurchaseComponent;
  let fixture: ComponentFixture<ProductwisepurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductwisepurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductwisepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
