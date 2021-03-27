import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorywisestockComponent } from './categorywisestock.component';

describe('CategorywisestockComponent', () => {
  let component: CategorywisestockComponent;
  let fixture: ComponentFixture<CategorywisestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorywisestockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorywisestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
