import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanwiseCollectionComponent } from './salesmanwise-collection.component';

describe('SalesmanwiseCollectionComponent', () => {
  let component: SalesmanwiseCollectionComponent;
  let fixture: ComponentFixture<SalesmanwiseCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanwiseCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanwiseCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
