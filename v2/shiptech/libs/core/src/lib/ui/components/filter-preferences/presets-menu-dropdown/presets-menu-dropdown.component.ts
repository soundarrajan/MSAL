import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { AgGridFilterPresetsService } from '../ag-filter-presets-service/ag-filter-presets.service';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  ColumnsStateResetSuccessfully,
  ToastPosition
} from '@shiptech/core/ui/components/filter-preferences/filter-preferences-messages';

@Component({
  selector: 'shiptech-presets-menu-dropdown',
  templateUrl: './presets-menu-dropdown.component.html',
  styleUrls: ['./presets-menu-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresetsMenuDropdownComponent implements OnInit {
  @Input() gridModelColumnApi: any;
  constructor(
    private filterPresetsService: AgGridFilterPresetsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  resetColumns(): void {
    try {
      if (this.gridModelColumnApi) {
        this.gridModelColumnApi.resetColumnState();
        this.toastr.info(ColumnsStateResetSuccessfully, '', ToastPosition);
      }
    } catch (e) {
      throwError('An error occured while resetting column state: ' + e);
    }
  }

  createFilter(): void {
    this.filterPresetsService.openSaveAsDialog();
  }

  updateFilter(): void {
    this.filterPresetsService.emitUpdateFilterPreset();
    this.toastr.success("Preference was succesfully updated");
  }

  exportExcel(): void {
    alert('Wait for it...');
  }
}
