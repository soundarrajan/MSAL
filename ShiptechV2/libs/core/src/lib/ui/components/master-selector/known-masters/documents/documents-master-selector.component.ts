import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import _ from 'lodash';
import {RowSelection} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {DocumentsMasterSelectorGridViewModel} from "@shiptech/core/ui/components/master-selector/known-masters/documents/view-model/documents-master-selector-grid.view-model";
import {IDocumentsMasterDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto";

@Component({
  selector: 'shiptech-documents-master-selector',
  templateUrl: './documents-master-selector.component.html',
  styleUrls: ['./documents-master-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentsMasterSelectorComponent),
      multi: true
    },
    DocumentsMasterSelectorGridViewModel
  ],
  exportAs: 'documentsMasterSelector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DocumentsMasterSelectorComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  private _entityId: number;
  private _entityName: string;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() multiple: boolean = false;
  @Input() selected: IDocumentsMasterDto | IDocumentsMasterDto[];

  @Output() selectedChange = new EventEmitter<IDocumentsMasterDto | IDocumentsMasterDto[]>();

  constructor(public gridViewModel: DocumentsMasterSelectorGridViewModel, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) {
  }

  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    this.gridViewModel.entityId = this.entityId;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
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

    const documents = selectedNodes.map((n: { data: IDocumentsMasterDto }) => n.data);

    if (documents.length !== 1) {
      this.toastr.warning(this.multiple ? 'Please select at least one row first.' : 'Please select at one row first.');
      return;
    }

    this.selected = this.multiple ? documents : _.first(documents);
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
