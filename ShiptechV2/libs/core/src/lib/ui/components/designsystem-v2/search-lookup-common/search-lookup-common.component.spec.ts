import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLookupCommonComponent } from './search-lookup-common.component';

describe('SearchLookupCommonComponent', () => {
  let component: SearchLookupCommonComponent;
  let fixture: ComponentFixture<SearchLookupCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLookupCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLookupCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
