import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NillstockreportComponent } from './nillstockreport.component';

describe('NillstockreportComponent', () => {
  let component: NillstockreportComponent;
  let fixture: ComponentFixture<NillstockreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NillstockreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NillstockreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
