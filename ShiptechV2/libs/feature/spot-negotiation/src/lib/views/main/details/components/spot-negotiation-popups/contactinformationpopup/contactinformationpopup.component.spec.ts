import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactinformationpopupComponent } from './contactinformationpopup.component';

describe('ContactinformationpopupComponent', () => {
  let component: ContactinformationpopupComponent;
  let fixture: ComponentFixture<ContactinformationpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactinformationpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactinformationpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
