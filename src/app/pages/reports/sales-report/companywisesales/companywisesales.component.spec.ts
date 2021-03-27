import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanywisesalesComponent } from './companywisesales.component';

describe('CompanywisesalesComponent', () => {
  let component: CompanywisesalesComponent;
  let fixture: ComponentFixture<CompanywisesalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanywisesalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanywisesalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
