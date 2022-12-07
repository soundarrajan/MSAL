import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCounterpartyPopupComponent } from './remove-counterparty-popup.component';

describe('RemoveCounterpartyPopupComponent', () => {
  let component: RemoveCounterpartyPopupComponent;
  let fixture: ComponentFixture<RemoveCounterpartyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCounterpartyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCounterpartyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
