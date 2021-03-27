import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSettlementComponent } from './room-settlement.component';

describe('RoomSettlementComponent', () => {
  let component: RoomSettlementComponent;
  let fixture: ComponentFixture<RoomSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
