import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTowerHomeNewComponent } from './control-tower-home-new.component';

describe('ControlTowerHomeNewComponent', () => {
  let component: ControlTowerHomeNewComponent;
  let fixture: ComponentFixture<ControlTowerHomeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTowerHomeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTowerHomeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
