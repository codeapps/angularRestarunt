import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTouchComponent } from './pos-touch.component';

describe('PosTouchComponent', () => {
  let component: PosTouchComponent;
  let fixture: ComponentFixture<PosTouchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosTouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
