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
  EventEmitter
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'shiptech-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent {
  @Input('model') set _setModel(model) {
    this.inputModel = model;
  }
  @Input('label') set setLabel(label) {
    this.inputLabel = label;
  }

  @Input('options') set _selectedOptions(options) {
    if (!options) {
      return;
    }
    this.options = options.map(value => ({
      label: value.displayName,
      value: value.id
    }));
    this.originalOptions = options;

    this.options2 = options;
  }
  animalControl = new FormControl('', Validators.required);

  originalOptions: any;
  options: any;
  options2: any;
  inputModel: any;
  inputLabel: any;
  selectedValue: string;

  @Output() changeInput = new EventEmitter<string>();
  @Input() public disabled = false;

  constructor() {}

  onModelChanged(value: string): void {
    // this.inputModel = value;
    this.changeInput.next(value);
  }
}
