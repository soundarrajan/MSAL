import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlTowerResidueDifferenceComponent } from './control-tower-residue-difference.component';

describe('ControlTowerResidueDifferenceComponent', () => {
  let component: ControlTowerResidueDifferenceComponent;
  let fixture: ComponentFixture<ControlTowerResidueDifferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlTowerResidueDifferenceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTowerResidueDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
