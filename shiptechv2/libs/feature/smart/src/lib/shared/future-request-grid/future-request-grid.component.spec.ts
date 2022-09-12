import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureRequestGridComponent } from './future-request-grid.component';

describe('FutureRequestGridComponent', () => {
  let component: FutureRequestGridComponent;
  let fixture: ComponentFixture<FutureRequestGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutureRequestGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureRequestGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
