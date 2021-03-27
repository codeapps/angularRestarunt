import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeappsmenuSettingsComponent } from './codeappsmenu-settings.component';

describe('CodeappsmenuSettingsComponent', () => {
  let component: CodeappsmenuSettingsComponent;
  let fixture: ComponentFixture<CodeappsmenuSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeappsmenuSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeappsmenuSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
