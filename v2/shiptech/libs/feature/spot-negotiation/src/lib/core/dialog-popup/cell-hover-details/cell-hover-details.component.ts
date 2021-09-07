import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-cell-hover-details',
  templateUrl: './cell-hover-details.component.html',
  styleUrls: ['./cell-hover-details.component.scss']
})
export class CellHoverDetailsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CellHoverDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.myControl.setValue('Diesel tank');
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three', 'Diesel tank'];
  filteredOptions: Observable<string[]>;
  isEdit: boolean = false;
  public option = 'Diesel tank';
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
