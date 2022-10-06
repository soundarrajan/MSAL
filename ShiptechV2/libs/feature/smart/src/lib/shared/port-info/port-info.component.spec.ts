import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortInfoComponent } from './port-info.component';

describe('PortInfoComponent', () => {
  let component: PortInfoComponent;
  let fixture: ComponentFixture<PortInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
