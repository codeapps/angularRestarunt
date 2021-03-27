import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackuptakenComponent } from './backuptaken.component';

describe('BackuptakenComponent', () => {
  let component: BackuptakenComponent;
  let fixture: ComponentFixture<BackuptakenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackuptakenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackuptakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
