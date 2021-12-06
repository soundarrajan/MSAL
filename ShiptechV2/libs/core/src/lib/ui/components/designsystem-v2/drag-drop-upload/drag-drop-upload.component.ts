import { Component, OnInit, ViewChild } from '@angular/core';
import { UpDownloadGridComponent } from '../up-download-grid/up-download-grid.component';

@Component({
  selector: 'app-drag-drop-upload',
  templateUrl: './drag-drop-upload.component.html',
  styleUrls: ['./drag-drop-upload.component.css']
})
export class DragDropUploadComponent implements OnInit {
  @ViewChild(UpDownloadGridComponent) uploadgrid: UpDownloadGridComponent;
  constructor() { }

  ngOnInit(): void {
  }

  files: any[] = [];
  public doc_type;
  public enableFileUpload: boolean = false;
  public enableDrag: boolean = false;
  enableUpload(e) {
    //console.log(e.);
   this.doc_type = e.value;
   //(this.doc_type);
    this.enableFileUpload = true;
    this.enableDrag = true;
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }



  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.uploadgrid.uploadDocument(this.files,this.doc_type);
    }

  }




}
