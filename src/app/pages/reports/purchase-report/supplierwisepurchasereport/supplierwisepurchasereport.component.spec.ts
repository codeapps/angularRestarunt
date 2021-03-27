import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierwisepurchasereportComponent } from './supplierwisepurchasereport.component';

describe('SupplierwisepurchasereportComponent', () => {
  let component: SupplierwisepurchasereportComponent;
  let fixture: ComponentFixture<SupplierwisepurchasereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierwisepurchasereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierwisepurchasereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
