import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonmovingitemComponent } from './nonmovingitem.component';

describe('NonmovingitemComponent', () => {
  let component: NonmovingitemComponent;
  let fixture: ComponentFixture<NonmovingitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonmovingitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonmovingitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
