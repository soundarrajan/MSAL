import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLegendComponent } from './table-legend.component';

describe('TableLegendComponent', () => {
  let component: TableLegendComponent;
  let fixture: ComponentFixture<TableLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
