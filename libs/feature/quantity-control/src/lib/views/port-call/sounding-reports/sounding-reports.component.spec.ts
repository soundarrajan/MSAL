import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundingReportsComponent } from './sounding-reports.component';

describe('SoundingReportsComponent', () => {
  let component: SoundingReportsComponent;
  let fixture: ComponentFixture<SoundingReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SoundingReportsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
