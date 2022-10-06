import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoAdditionalcostComponent } from './spotnego-additionalcost.component';

describe('SpotnegoAdditionalcostComponent', () => {
  let component: SpotnegoAdditionalcostComponent;
  let fixture: ComponentFixture<SpotnegoAdditionalcostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoAdditionalcostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoAdditionalcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
