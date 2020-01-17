import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/primeng";

@Component({
  selector: 'shiptech-document-view-edit-notes',
  templateUrl: './document-view-edit-notes.component.html',
  styleUrls: ['./document-view-edit-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewEditNotesComponent implements OnInit {

  comment: string;

  constructor(public dialogRef: DynamicDialogRef, public config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    if(this.config.data.comment){
      this.comment = this.config.data.comment;
    }
  }

  save(): void {
    this.dialogRef.close(this.comment);
  }
}
