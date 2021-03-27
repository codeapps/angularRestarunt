import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanywisepurchaseComponent } from './companywisepurchase.component';

describe('CompanywisepurchaseComponent', () => {
  let component: CompanywisepurchaseComponent;
  let fixture: ComponentFixture<CompanywisepurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanywisepurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanywisepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
