import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesspopupComponent } from './successpopup.component';

describe('SuccesspopupComponent', () => {
  let component: SuccesspopupComponent;
  let fixture: ComponentFixture<SuccesspopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccesspopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
