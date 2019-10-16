import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainQuantityControlComponent } from './main-quantity-control.component';

describe('MainQualityControlComponent', () => {
  let component: MainQuantityControlComponent;
  let fixture: ComponentFixture<MainQuantityControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainQuantityControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainQuantityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
