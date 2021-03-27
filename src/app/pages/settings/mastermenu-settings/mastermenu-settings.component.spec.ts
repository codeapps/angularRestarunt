import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MastermenuSettingsComponent } from './mastermenu-settings.component';

describe('MastermenuSettingsComponent', () => {
  let component: MastermenuSettingsComponent;
  let fixture: ComponentFixture<MastermenuSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastermenuSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastermenuSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
