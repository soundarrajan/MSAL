import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCommentsPopupComponent } from './supplier-comments-popup.component';

describe('SupplierCommentsPopupComponent', () => {
  let component: SupplierCommentsPopupComponent;
  let fixture: ComponentFixture<SupplierCommentsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCommentsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCommentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
