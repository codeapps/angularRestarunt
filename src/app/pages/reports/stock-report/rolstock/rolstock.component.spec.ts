import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolstockComponent } from './rolstock.component';

describe('RolstockComponent', () => {
  let component: RolstockComponent;
  let fixture: ComponentFixture<RolstockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolstockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
