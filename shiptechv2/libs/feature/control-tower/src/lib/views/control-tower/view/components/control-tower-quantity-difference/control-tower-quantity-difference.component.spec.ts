import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlTowerQuantityDifferenceComponent } from './control-tower-quantity-difference.component';


describe('ControlTowerQuantityDifferenceComponent', () => {
  let component: ControlTowerQuantityDifferenceComponent;
  let fixture: ComponentFixture<ControlTowerQuantityDifferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTowerQuantityDifferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTowerQuantityDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
