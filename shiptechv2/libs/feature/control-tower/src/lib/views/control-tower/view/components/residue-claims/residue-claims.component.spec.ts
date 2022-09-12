import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueClaimsComponent } from './residue-claims.component';

describe('ResidueClaimsComponent', () => {
  let component: ResidueClaimsComponent;
  let fixture: ComponentFixture<ResidueClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidueClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
