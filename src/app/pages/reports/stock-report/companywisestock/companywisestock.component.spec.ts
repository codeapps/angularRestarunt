import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanywisestockComponent } from './companywisestock.component';

describe('CompanywisestockComponent', () => {
  let component: CompanywisestockComponent;
  let fixture: ComponentFixture<CompanywisestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanywisestockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanywisestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
