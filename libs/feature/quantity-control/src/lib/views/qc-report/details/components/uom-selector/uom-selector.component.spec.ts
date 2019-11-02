import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomSelectorComponent } from './uom-selector.component';

describe('UomSelectorComponent', () => {
  let component: UomSelectorComponent;
  let fixture: ComponentFixture<UomSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UomSelectorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
