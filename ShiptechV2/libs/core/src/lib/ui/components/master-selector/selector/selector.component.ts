import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import _ from 'lodash';
import {RowSelection} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {DocumentsMasterSelectorGridViewModel} from '@shiptech/core/ui/components/master-selector/masters-models/documents-model/documents-master-selector-grid.view-model';
import {IDocumentsMasterDto} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';
import {VesselMasterSelectorGridViewModel} from '@shiptech/core/ui/components/master-selector/masters-models/vessel-model/vessel-master-selector-grid.view-model';
import {knownMastersAutocomplete} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import {IVesselMasterDto} from '@shiptech/core/services/masters-api/request-response-dtos/vessel';
import {VesselPortCallsMasterSelectorGridViewModel} from '@shiptech/core/ui/components/master-selector/masters-models/vessel-port-calls-model/vessel-port-calls-master-selector-grid.view-model';
import {IVesselPortCallMasterDto} from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import {throwError} from 'rxjs';
import {IMasterModelInterface} from '@shiptech/core/ui/components/master-selector/masters-models/master-model.interface';

@Component({
  selector: 'shiptech-shared-master-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    },
    DocumentsMasterSelectorGridViewModel,
    VesselMasterSelectorGridViewModel,
    VesselPortCallsMasterSelectorGridViewModel
  ],
  exportAs: 'sharedMasterSelector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectorComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  private _entityId: number;
  private _entityName: string;
  private _vesselId: number;

  @Input() _selectorType: string;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() multiple: boolean = false;
  @Input() selected: IDocumentsMasterDto | IVesselMasterDto | IVesselPortCallMasterDto | (IVesselPortCallMasterDto | IVesselMasterDto | IDocumentsMasterDto)[];

  gridViewModel: IMasterModelInterface;

  @Output() selectedChange = new EventEmitter<IDocumentsMasterDto | IVesselMasterDto | IVesselPortCallMasterDto | (IVesselPortCallMasterDto | IVesselMasterDto | IDocumentsMasterDto)[]>();

  constructor(private gridViewModelDocuments: DocumentsMasterSelectorGridViewModel,
              private gridViewModelVessel: VesselMasterSelectorGridViewModel,
              private gridViewModelVesselPort: VesselPortCallsMasterSelectorGridViewModel,
              private toastr: ToastrService,
              private changeDetector: ChangeDetectorRef) {
  }

  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  get vesselId(): number {
    return this._vesselId;
  }

  get selectorType(): string {
    return this._selectorType;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
  }

  @Input() set vesselId(value: number) {
    this._vesselId = value;
  }

  @Input() set selectorType(value: string) {
    this._selectorType = value;
    this.setGridModelType();

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  setGridModelType(): void {
    switch (this.selectorType) {
      case knownMastersAutocomplete.documents: {
        this.gridViewModel = this.gridViewModelDocuments;
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.vessel: {
        this.gridViewModel = this.gridViewModelVessel;
        break;
      }
      case knownMastersAutocomplete.vesselPort: {
        this.gridViewModel = this.gridViewModelVesselPort;
        this.gridViewModel.vesselId = this.vesselId;
        break;
      }
      default:
        throwError(`${SelectorComponent.name} hasn't defined the selector type`);
    }
    console.log(this.gridViewModel);
  }

  onModelChange: Function = () => {
  };

  onModelTouched: Function = () => {
  };

  ngOnInit(): void {
    // this.setGridModelType();
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

    const entity = selectedNodes.map((n: { data: IDocumentsMasterDto | IVesselMasterDto | IVesselPortCallMasterDto }) => n.data);

    if (entity.length !== 1) {
      this.toastr.warning(this.multiple ? 'Please select at least one row first.' : 'Please select at one row first.');
      return;
    }

    this.selected = this.multiple ? entity : _.first(entity);
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
