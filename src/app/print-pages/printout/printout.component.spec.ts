import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintoutComponent } from './printout.component';

describe('PrintoutComponent', () => {
  let component: PrintoutComponent;
  let fixture: ComponentFixture<PrintoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
