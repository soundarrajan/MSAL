import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'aggrid-cell-data',
  template: `
    <div *ngIf="params.type === 'cell-edit-dropdown'">
      <mat-form-field class="ag-grid-formfield">
        <mat-select [(ngModel)]="params.value" disableOptionCentering>
          <mat-option value="{{ item }}" *ngFor="let item of params.items">{{
            item
          }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div *ngIf="params.type === 'cell-edit-autocomplete'">
      <mat-form-field class="ag-grid-formfield">
        <input
          matInput
          [formControl]="myControl"
          [matAutocomplete]="autodyield"
        />
        <mat-autocomplete #autodyield="matAutocomplete" class="darkPanelAuto">
          <mat-option
            *ngFor="let option of filteredOptions | async"
            [value]="option"
          >
            {{ option }}
          </mat-option>
        </mat-autocomplete>
        <mat-icon matSuffix><div class="search-img-dark"></div></mat-icon>
      </mat-form-field>
    </div>

    <div *ngIf="params.type === 'cell-edit-value-autocomplete'">
      <div
        class="editable-cell"
        style="text-align:right;width: 160px; padding-right: 10px; float: left; margin-left: -10px;"
      >
        <span>{{ params.value }}</span>
      </div>
      <mat-form-field
        class="ag-grid-formfield editable-cell uom-editable-cell"
        style="width: 105px; padding: 5px 10px;"
      >
        <input
          matInput
          [formControl]="myControl"
          [matAutocomplete]="autodyield"
        />
        <mat-autocomplete #autodyield="matAutocomplete" class="darkPanelAuto">
          <mat-option
            *ngFor="let option of filteredOptions | async"
            [value]="option"
          >
            {{ option }}
          </mat-option>
        </mat-autocomplete>
        <mat-icon matSuffix
          ><div class="search-img-dark" style="margin-left: 5px;"></div
        ></mat-icon>
      </mat-form-field>
    </div>
  `,
  styles: []
})
export class AGGridCellEditableComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: string;

  public selectedCostType = 'Pay';
  public selectedRateType = 'Flat';

  myControl = new FormControl();
  costNameOptions: string[] = ['Barging', 'Barging Two', 'Barging Three'];
  sericeProviderOptions: string[] = ['Kinder Morgan', 'ARM Fuels'];
  specParameterOptions: string[] = ['TAN'];
  specGroupOptions: string[] = ['Default Spec Group'];
  productOptions: string[] = ['Ethanol'];
  customStatusOptions: string[] = ['Status1'];
  cnCodeOptions: string[] = ['Code1'];
  filteredOptions: Observable<string[]>;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/customicons/calendar-dark.svg'
      )
    );
  }

  ngOnInit() {
    switch (this.params.label) {
      case 'cost-name': {
        this.myControl.setValue('Barging');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.costNameOptions))
        );
        break;
      }
      case 'service-provider': {
        this.myControl.setValue('ARM Fuels');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.sericeProviderOptions))
        );
        break;
      }
      case 'spec-parameter': {
        this.myControl.setValue('TAN');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.specParameterOptions))
        );
        break;
      }
      case 'spec-param':
      case 'spec-group': {
        this.myControl.setValue('Default Spec Group');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.specGroupOptions))
        );
        break;
      }
      case 'product': {
        this.myControl.setValue('Ethanol');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.productOptions))
        );
        break;
      }
      case 'cn-code': {
        this.myControl.setValue('Code1');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.cnCodeOptions))
        );
        break;
      }
      case 'custom-status': {
        this.myControl.setValue('Status1');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.customStatusOptions))
        );
        break;
      }
      case 'uom': {
        this.myControl.setValue('GAL');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.customStatusOptions))
        );
        break;
      }
    }
  }

  agInit(params: any): void {
    this.params = params;
    this.toolTip = params.value;
  }

  refresh(): boolean {
    return false;
  }
  private _filter(value: string, options): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
