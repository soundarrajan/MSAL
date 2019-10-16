import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCallsListComponent } from './port-calls-list.component';

describe('PortCallsListComponent', () => {
  let component: PortCallsListComponent;
  let fixture: ComponentFixture<PortCallsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortCallsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortCallsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
