import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoemaillogComponent } from './spotnegoemaillog.component';

describe('SpotnegoemaillogComponent', () => {
  let component: SpotnegoemaillogComponent;
  let fixture: ComponentFixture<SpotnegoemaillogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoemaillogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoemaillogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
