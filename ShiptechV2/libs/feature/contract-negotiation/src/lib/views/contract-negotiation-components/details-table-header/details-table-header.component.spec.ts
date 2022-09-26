import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTableHeaderComponent } from './details-table-header.component';

describe('DetailsTableHeaderComponent', () => {
  let component: DetailsTableHeaderComponent;
  let fixture: ComponentFixture<DetailsTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTableHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
