import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryHeadComponent } from './category-head.component';

describe('CategoryHeadComponent', () => {
  let component: CategoryHeadComponent;
  let fixture: ComponentFixture<CategoryHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
