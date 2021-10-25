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
import { FormControl } from '@angular/forms';
import { Select } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'shiptech-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InputComponent {
  @Input('model') set _selectedOption(model) {
    this.inputModel = model;
  }
  @Input('label') set setLabel(label) {
    this.inputLabel = label;
  }
  public options: SelectItem[];
  public inputModel: any;
  inputLabel: any;

  @Output() changeInput = new EventEmitter<string>();
  @Input() public disabled = false;

  constructor() {}

  onModelChanged(value: string): void {
    // this.inputModel = value;
    this.changeInput.next(value);
  }
}
