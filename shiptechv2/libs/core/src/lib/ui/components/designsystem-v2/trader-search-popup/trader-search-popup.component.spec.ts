import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderSearchPopupComponent } from './trader-search-popup.component';

describe('TraderSearchPopupComponent', () => {
  let component: TraderSearchPopupComponent;
  let fixture: ComponentFixture<TraderSearchPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderSearchPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
