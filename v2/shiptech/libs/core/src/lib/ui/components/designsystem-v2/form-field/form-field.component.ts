import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from "@angular/router"

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})

export class FormFieldComponent implements OnInit {

  @Input('type') type;
  @Input('switchTheme') switchTheme;//false-Light Theme, true- Dark Theme

  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private router: Router) {
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/calendar-dark.svg'));
    iconRegistry.addSvgIcon(
      'data-picker-white',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/calendar-white.svg'));
  }


  myControl = new FormControl();
  myControl1 = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  navigate() {
    this.router.navigate([]).then(result => { window.open('dsComponents/v2Components', '_blank'); });
  }

  openPopup() {
    const dialogRef = this.dialog.open(DialogPopupExampleDialog, {
      width: '480px',
      height: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}


@Component({
  selector: 'dialog-popup-example',
  template:
    `
    <h3 mat-dialog-title>Sample Search Popup</h3>
    <div mat-dialog-content>
    </div>
    <div mat-dialog-actions>
    </div>
  `,
})
export class DialogPopupExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogPopupExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data) { }
}
