import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartOperatorComponent } from './smart-operator.component';

describe('SmartOperatorComponent', () => {
  let component: SmartOperatorComponent;
  let fixture: ComponentFixture<SmartOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
