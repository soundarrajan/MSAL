import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityLabsComponent } from './quality-labs.component';

describe('QualityLabsComponent', () => {
  let component: QualityLabsComponent;
  let fixture: ComponentFixture<QualityLabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityLabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
