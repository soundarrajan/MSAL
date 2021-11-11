import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDifferenceComponent } from './residue-difference.component';

describe('ResidueDifferenceComponent', () => {
  let component: ResidueDifferenceComponent;
  let fixture: ComponentFixture<ResidueDifferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidueDifferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
