import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InatechGridComponent } from './inatech-grid.component';

describe('InatechGridComponent', () => {
  let component: InatechGridComponent;
  let fixture: ComponentFixture<InatechGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InatechGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InatechGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
