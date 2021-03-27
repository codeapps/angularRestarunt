import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopAutocompleteComponent } from './pop-autocomplete.component';

describe('PopAutocompleteComponent', () => {
  let component: PopAutocompleteComponent;
  let fixture: ComponentFixture<PopAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
