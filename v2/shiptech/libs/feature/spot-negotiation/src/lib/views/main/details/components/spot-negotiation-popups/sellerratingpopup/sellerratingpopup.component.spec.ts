import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerratingpopupComponent } from './sellerratingpopup.component';

describe('SellerratingpopupComponent', () => {
  let component: SellerratingpopupComponent;
  let fixture: ComponentFixture<SellerratingpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerratingpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerratingpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
