import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCallGridComponent } from './port-call-grid.component';

describe('PortCallGridComponent', () => {
  let component: PortCallGridComponent;
  let fixture: ComponentFixture<PortCallGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PortCallGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortCallGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
