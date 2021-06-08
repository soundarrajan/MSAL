import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningoperatorpopupComponent } from './warningoperatorpopup.component';

describe('WarningoperatorpopupComponent', () => {
  let component: WarningoperatorpopupComponent;
  let fixture: ComponentFixture<WarningoperatorpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningoperatorpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningoperatorpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
