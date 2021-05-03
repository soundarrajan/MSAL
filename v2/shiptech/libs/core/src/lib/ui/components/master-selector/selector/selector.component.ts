import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { DocumentsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/documents-model/documents-master-selector-grid.view-model';
import { IDocumentsMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';
import { VesselMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/vessel-model/vessel-master-selector-grid.view-model';
import { knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { IVesselMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel';
import { VesselPortCallsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/vessel-port-calls-model/vessel-port-calls-master-selector-grid.view-model';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { throwError } from 'rxjs';
import { OrderListSelectorGridViewModel } from '../view-models/order-model/order-list-selector-grid.view-model';
import { ProductListSelectorGridViewModel } from '../view-models/product-model/product-list-selector-grid.view-model';
import { PhysicalSupplierListSelectorGridViewModel } from '../view-models/physical-supplier-model/physical-supplier-list-selector-grid.view-model';
import { SellerListSelectorGridViewModel } from '../view-models/seller-model/seller-list-selector-grid.view-model';
import { CompanyListSelectorGridViewModel } from '../view-models/company-model/company-list-selector-grid.view-model';
import { SystemInstrumentListSelectorGridViewModel } from '../view-models/system-instrument-model/system-instrument-list-selector-grid.view-model';
import { CurrencyListSelectorGridViewModel } from '../view-models/currency-model/currency-list-selector-grid.view-model';
import { FormulaListSelectorGridViewModel } from '../view-models/formula-model/formula-list-selector-grid.view-model';

@Component({
  selector: 'shiptech-shared-master-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    },
    DocumentsMasterSelectorGridViewModel,
    VesselMasterSelectorGridViewModel,
    VesselPortCallsMasterSelectorGridViewModel,
    OrderListSelectorGridViewModel,
    ProductListSelectorGridViewModel,
    PhysicalSupplierListSelectorGridViewModel,
    SellerListSelectorGridViewModel,
    CompanyListSelectorGridViewModel,
    SystemInstrumentListSelectorGridViewModel,
    CurrencyListSelectorGridViewModel,
    FormulaListSelectorGridViewModel
  ],
  exportAs: 'sharedMasterSelector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectorComponent
  implements OnInit, ControlValueAccessor, AfterViewInit {
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
  @Input() set productTypeId(value: number) {
    this._productTypeId = value;
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

  @Input() _selectorType: string;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() multiple: boolean = false;
  @Input() headerName: string;
  @Input() selected:
    | IDocumentsMasterDto
    | IVesselMasterDto
    | IVesselPortCallMasterDto
    | (IVesselPortCallMasterDto | IVesselMasterDto | IDocumentsMasterDto)[];

  gridViewModel: any;

  @Output() selectedChange = new EventEmitter<
    | IDocumentsMasterDto
    | IVesselMasterDto
    | IVesselPortCallMasterDto
    | (IVesselPortCallMasterDto | IVesselMasterDto | IDocumentsMasterDto)[]
  >();
  @Output() shouldCloseModal = new EventEmitter<void>();
  private _entityId: number;
  private _entityName: string;
  private _vesselId: number;
  private _productTypeId:number;
  constructor(
    private injector: Injector,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {}

  setGridModelType(): void {
    switch (this.selectorType) {
      case knownMastersAutocomplete.documents: {
        this.gridViewModel = this.injector.get(
          DocumentsMasterSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.orders: {
        this.gridViewModel = this.injector.get(
         OrderListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.products: {
        this.gridViewModel = this.injector.get(
          ProductListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        this.gridViewModel.productTypeId=this.productTypeId;
        break;
      }
      case knownMastersAutocomplete.physicalSupplier: {
        this.gridViewModel = this.injector.get(
          PhysicalSupplierListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.formula: {
        this.gridViewModel = this.injector.get(
          FormulaListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.systemInstrument: {
        this.gridViewModel = this.injector.get(
          SystemInstrumentListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.currency: {
        this.gridViewModel = this.injector.get(
          CurrencyListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.sellers: {
        this.gridViewModel = this.injector.get(
          SellerListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.company: {
        this.gridViewModel = this.injector.get(
          CompanyListSelectorGridViewModel
        );
        this.gridViewModel.entityId = this.entityId;
        this.gridViewModel.entityName = this.entityName;
        break;
      }
      case knownMastersAutocomplete.vessel: {
        this.gridViewModel = this.injector.get(
          VesselMasterSelectorGridViewModel
        );
        break;
      }
      case knownMastersAutocomplete.vesselPort: {
        this.gridViewModel = this.injector.get(
          VesselPortCallsMasterSelectorGridViewModel
        );
        this.gridViewModel.vesselId = this.vesselId;
        break;
      }
      default:
        throwError(
          `${SelectorComponent.name} hasn't defined the selector type`
        );
    }
  }

  onModelChange: Function = () => {};

  onModelTouched: Function = () => {};

  ngOnInit(): void {
    this.gridViewModel.gridOptions.rowSelection = this.multiple
      ? RowSelection.Multiple
      : RowSelection.Single;
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

    const entity = selectedNodes.map(
      (n: {
        data: IDocumentsMasterDto | IVesselMasterDto | IVesselPortCallMasterDto;
      }) => n.data
    );

    if (entity.length !== 1) {
      this.toastr.warning(
        this.multiple
          ? 'Please select at least one row first.'
          : 'Please select at one row first.'
      );
      return;
    }

    this.selected = this.multiple ? entity : _.first(entity);
    this.onModelTouched();
    this.onModelChange(this.selected);
    this.selectedChange.emit(this.selected);

    this.changeDetector.markForCheck();
  }

  ngAfterViewInit(): void {}

  onPageChange(page: number): void {
    this.gridViewModel.page = page;

    this.changeDetector.markForCheck();
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;

    this.changeDetector.markForCheck();
  }

  closeModal(): void {
    this.shouldCloseModal.emit();
  }
}
