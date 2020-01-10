import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { VesselPortCallsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/known-masters/vessel-port-calls/view-model/vessel-port-calls-master-selector-grid.view-model';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';

@Component({
  selector: 'shiptech-vessel-port-calls-master-selector',
  templateUrl: './vessel-port-calls-master-selector.component.html',
  styleUrls: ['./vessel-port-calls-master-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VesselPortCallsMasterSelectorComponent),
      multi: true
    },
    VesselPortCallsMasterSelectorGridViewModel
  ],
  exportAs: 'vesselPortCallsMasterSelector',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VesselPortCallsMasterSelectorComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  private _vesselId: number;

  get vesselId(): number {
    return this._vesselId;
  }

  @Input() set vesselId(value: number) {
    this._vesselId = value;
    this.gridViewModel.vesselId = this.vesselId;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() selected: IVesselPortCallMasterDto | IVesselPortCallMasterDto[];

  @Output() selectedChange = new EventEmitter<IVesselPortCallMasterDto | IVesselPortCallMasterDto[]>();

  constructor(public gridViewModel: VesselPortCallsMasterSelectorGridViewModel, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) {
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
    this.changeDetector.markForCheck();
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
    this.changeDetector.markForCheck();
  }

  select(): void {
    const gridApi = this.gridViewModel.gridOptions.api;
    const selectedNodes = gridApi.getSelectedNodes() || [];

    const vesselPortCalls = selectedNodes.map((n: { data: IVesselPortCallMasterDto }) => n.data);

    if (vesselPortCalls.length !== 1) {
      this.toastr.warning(this.multiple ? 'Please select at least one row first.' : 'Please select at one row first.');
      return;
    }

    this.selected = this.multiple ? vesselPortCalls : _.first(vesselPortCalls);
    this.onModelTouched();
    this.onModelChange(this.selected);
    this.selectedChange.emit(this.selected);

    this.changeDetector.markForCheck();
  }

  ngAfterViewInit(): void {

  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;

    this.changeDetector.markForCheck();
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;

    this.changeDetector.markForCheck();
  }
}
