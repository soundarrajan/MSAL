import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'search-popup-dialog',
    template:
        `
        <div class="header-container">
        <div class="title">Spec Parameter</div>
        <div class="popup-close-icon"  [mat-dialog-close]="true"></div>
        </div>
        <div>
            <mat-dialog-content>
            
            </mat-dialog-content>
        </div>
        <div>
            <mat-dialog-actions align="end">
                <button class="save-action-btn" [mat-dialog-close]="true">
                    <span>Save</span>
                </button>
            </mat-dialog-actions>
        </div>
        `,
})
export class SearchPopupDialog {

    ngOnInit() {
    }
    constructor(
        public dialogRef: MatDialogRef<SearchPopupDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }
}