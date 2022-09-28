import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDragDropUploadComponent } from './doc-drag-drop-upload.component';

describe('DocDragDropUploadComponent', () => {
  let component: DocDragDropUploadComponent;
  let fixture: ComponentFixture<DocDragDropUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocDragDropUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDragDropUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
