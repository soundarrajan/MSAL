import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityClaimsComponent } from './quantity-claims.component';

describe('QuantityClaimsComponent', () => {
  let component: QuantityClaimsComponent;
  let fixture: ComponentFixture<QuantityClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
