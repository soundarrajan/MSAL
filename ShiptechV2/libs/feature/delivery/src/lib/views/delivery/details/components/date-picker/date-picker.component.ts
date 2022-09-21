import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Injectable,
  ReflectiveInjector,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

import { formatDate } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter
} from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';

export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(value: Date, displayFormat: string): string {
    if (value === null || value === undefined) return undefined;
    return moment(value).format(dateTimeAdapter.fromDotNet(displayFormat));
  }
}

@Component({
  selector: 'shiptech-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class DatePickerComponent {
  @Input('model') set _selectedOption(model) {
    this.inputModel = model;
  }
  @Input('label') set setLabel(label) {
    this.inputLabel = label;
  }
  public options: SelectItem[];
  public inputModel: any;
  inputLabel: any;

  @Output() changeInput = new EventEmitter<any>();
  @Input() public disabled = false;

  constructor(
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    private format: TenantFormattingService
  ) {
    this.dateFormats.display.dateInput = this.format.dateFormat;
  }

  onModelChanged(value: string): void {
    this.inputModel = value;
    //var localTime = moment(value).format('YYYY-MM-DD'); // store localTime
    this.changeInput.next(value);
  }
}
