import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicablecostpopupComponent } from './applicablecostpopup.component';

describe('ApplicablecostpopupComponent', () => {
  let component: ApplicablecostpopupComponent;
  let fixture: ComponentFixture<ApplicablecostpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicablecostpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicablecostpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
