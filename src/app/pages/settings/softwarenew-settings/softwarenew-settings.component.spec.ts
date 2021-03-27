import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwarenewSettingsComponent } from './softwarenew-settings.component';

describe('SoftwarenewSettingsComponent', () => {
  let component: SoftwarenewSettingsComponent;
  let fixture: ComponentFixture<SoftwarenewSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwarenewSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwarenewSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
