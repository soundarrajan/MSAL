import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocPanDataComponent } from './loc-pan-data.component';

describe('LocPanDataComponent', () => {
  let component: LocPanDataComponent;
  let fixture: ComponentFixture<LocPanDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocPanDataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocPanDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
