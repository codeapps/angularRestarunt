import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraEntryComponent } from './contra-entry.component';

describe('ContraEntryComponent', () => {
  let component: ContraEntryComponent;
  let fixture: ComponentFixture<ContraEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContraEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
