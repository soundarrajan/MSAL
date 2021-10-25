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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'shiptech-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AutocompleteInputComponent implements OnInit {
  @Input('options') set _options(options) {
    this.options = options;
  }

  @Input('selectedOption') set _selectedOption(option) {
    if (!option) {
      return;
    }
    this.selectedOptionId = option.id;
  }

  @Input('model') set _setInputModel(model) {
    this.inputModel = model;
  }

  @Output() changeInput = new EventEmitter<string>();

  filteredOptions: any;
  options: any;
  selectedOptionId: any;
  inputModel: any;

  myControl = new FormControl();

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {}

  filterOptionsList(): any {
    const filterValue = this.myControl.value ? this.myControl.value : '';
    return this.options
      ? this.options
          .filter(
            option => option.name.toLowerCase().indexOf(filterValue) === 0
          )
          .splice(0, 10)
      : [];
  }

  onModelChanged(value: string): void {
    this.changeInput.next(value);
  }
}
