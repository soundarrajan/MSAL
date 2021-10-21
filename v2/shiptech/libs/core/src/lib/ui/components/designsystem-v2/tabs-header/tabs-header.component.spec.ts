import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsHeaderComponent } from './tabs-header.component';

describe('TabsHeaderComponent', () => {
  let component: TabsHeaderComponent;
  let fixture: ComponentFixture<TabsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
