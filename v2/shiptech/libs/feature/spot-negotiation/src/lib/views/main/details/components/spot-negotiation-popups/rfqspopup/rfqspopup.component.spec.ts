import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqspopupComponent } from './rfqspopup.component';

describe('RfqspopupComponent', () => {
  let component: RfqspopupComponent;
  let fixture: ComponentFixture<RfqspopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqspopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
