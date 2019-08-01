import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WonderBarComponent } from './wonder-bar.component';

describe('WonderBarComponent', () => {
  let component: WonderBarComponent;
  let fixture: ComponentFixture<WonderBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WonderBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WonderBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
