import {
  Directive,
  EventEmitter,
  Output,
  HostListener,
  HostBinding
} from '@angular/core';
@Directive({
  selector: '[appDragDropFileUpload]'
})
export class DragDropFileUploadDirective {
  @Output() fileDropped = new EventEmitter<any>();
  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event) {
    event.preventDefault();
    // this.background = '#e2eefd';
  }
  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  // Drop Event
  @HostListener('drop', ['$event']) public drop(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
