import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainQualityControlComponent } from './main-quality-control.component';

describe('MainQualityControlComponent', () => {
  let component: MainQualityControlComponent;
  let fixture: ComponentFixture<MainQualityControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainQualityControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainQualityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
