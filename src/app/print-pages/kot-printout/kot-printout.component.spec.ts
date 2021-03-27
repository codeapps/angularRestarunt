import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotPrintoutComponent } from './kot-printout.component';

describe('KotPrintoutComponent', () => {
  let component: KotPrintoutComponent;
  let fixture: ComponentFixture<KotPrintoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotPrintoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotPrintoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
