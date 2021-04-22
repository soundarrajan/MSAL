import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyDetailsComponent } from './readonly-details.component';

describe('ReadonlyDetailsComponent', () => {
  let component: ReadonlyDetailsComponent;
  let fixture: ComponentFixture<ReadonlyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadonlyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadonlyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
