import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestcontractpopupComponent } from './bestcontractpopup.component';

describe('BestcontractpopupComponent', () => {
  let component: BestcontractpopupComponent;
  let fixture: ComponentFixture<BestcontractpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestcontractpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestcontractpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
