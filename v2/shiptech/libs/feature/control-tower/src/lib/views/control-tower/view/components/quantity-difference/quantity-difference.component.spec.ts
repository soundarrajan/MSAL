import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityDifferenceComponent } from './quantity-difference.component';

describe('QuantityDifferenceComponent', () => {
  let component: QuantityDifferenceComponent;
  let fixture: ComponentFixture<QuantityDifferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityDifferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
