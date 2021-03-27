import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRegistrationComponent } from './room-registration.component';

describe('RoomRegistrationComponent', () => {
  let component: RoomRegistrationComponent;
  let fixture: ComponentFixture<RoomRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
