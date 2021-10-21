import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpDownloadGridComponent } from './up-download-grid.component';

describe('UpDownloadGridComponent', () => {
  let component: UpDownloadGridComponent;
  let fixture: ComponentFixture<UpDownloadGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpDownloadGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpDownloadGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
