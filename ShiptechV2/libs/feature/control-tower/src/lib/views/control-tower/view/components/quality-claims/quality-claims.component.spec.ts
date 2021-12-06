import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityClaimsComponent } from './quality-claims.component';

describe('QualityClaimsComponent', () => {
  let component: QualityClaimsComponent;
  let fixture: ComponentFixture<QualityClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
