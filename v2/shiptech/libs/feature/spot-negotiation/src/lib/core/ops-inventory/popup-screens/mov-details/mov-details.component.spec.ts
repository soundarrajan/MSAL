import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovDetailsComponent } from './mov-details.component';

describe('MovDetailsComponent', () => {
  let component: MovDetailsComponent;
  let fixture: ComponentFixture<MovDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
