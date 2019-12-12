import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VesselMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/known-masters/vessel/view-model/vessel-master-selector-grid.view-model';
import { IVesselMasterDto } from '@shiptech/core/services/masters-api/dtos/vessel';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';

@Component({
  selector: 'shiptech-vessel-master-selector',
  templateUrl: './vessel-master-selector.component.html',
  styleUrls: ['./vessel-master-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VesselMasterSelectorComponent),
      multi: true
    },
    VesselMasterSelectorGridViewModel
  ],
  exportAs: 'vesselMasterSelector'
})
export class VesselMasterSelectorComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() multiple: boolean = false;
  @Input() selected: IVesselMasterDto | IVesselMasterDto[];

  @Output() selectedChange = new EventEmitter<IVesselMasterDto | IVesselMasterDto[]>();

  constructor(public gridViewModel: VesselMasterSelectorGridViewModel, private toastr: ToastrService) {
  }

  onModelChange: Function = () => {
  };

  onModelTouched: Function = () => {
  };

  ngOnInit(): void {
    this.gridViewModel.gridOptions.rowSelection = this.multiple ? RowSelection.Multiple : RowSelection.Single;
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  writeValue(value: any): void {
    this.selected = value;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
  }

  select(): void {
    const gridApi = this.gridViewModel.gridOptions.api;
    const selectedNodes = gridApi.getSelectedNodes() || [];

    const vessels = selectedNodes.map((n: { data: IVesselMasterDto }) => n.data);

    if (vessels.length !== 1) {
      this.toastr.warning(this.multiple ? 'Please select at least one row first.' : 'Please select at one row first.');
      return;
    }

    this.selected = this.multiple ? vessels : _.first(vessels);
    this.onModelTouched();
    this.onModelChange(this.selected);
    this.selectedChange.emit(this.selected);
  }

  ngAfterViewInit(): void {

  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }
}
