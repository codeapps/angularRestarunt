import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotListComponent } from './kot-list.component';

describe('KotListComponent', () => {
  let component: KotListComponent;
  let fixture: ComponentFixture<KotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
