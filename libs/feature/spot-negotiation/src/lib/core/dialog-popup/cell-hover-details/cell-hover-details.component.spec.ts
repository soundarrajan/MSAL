import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellHoverDetailsComponent } from './cell-hover-details.component';

describe('CellHoverDetailsComponent', () => {
  let component: CellHoverDetailsComponent;
  let fixture: ComponentFixture<CellHoverDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CellHoverDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellHoverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
