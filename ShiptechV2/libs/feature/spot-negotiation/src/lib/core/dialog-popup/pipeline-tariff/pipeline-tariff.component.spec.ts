import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineTariffComponent } from './pipeline-tariff.component';

describe('PipelineTariffComponent', () => {
  let component: PipelineTariffComponent;
  let fixture: ComponentFixture<PipelineTariffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineTariffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
