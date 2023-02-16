import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ModuleError } from '@shiptech/core/ui/components/export/error-handling/module-error';
import { IDocumentsCreateUploadDetailsDto, IDocumentsCreateUploadDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { CommonApiService } from '@shiptech/core/services/common/common-api.service';
import { AGGridCellActionsDocumentsComponent } from '../../../core/ag-grid-renderers/ag-grid-cell-actions-documents.component';
import { AGGridCellV2RendererComponent } from '../../../core/ag-grid-renderers/ag-grid-cell-renderer-v2.component';
@Component({
  selector: 'app-doc-drag-drop-upload',
  templateUrl: './doc-drag-drop-upload.component.html',
  styleUrls: ['./doc-drag-drop-upload.component.css']
})
export class DocDragDropUploadComponent implements OnInit {
  public gridOptions_data: GridOptions;
  myControl = new FormControl();
  options = [];
  placeholder: string = '';
  filteredOptions: Observable<string[]>;
  documentTypeList: any[];
  documentType: any = null;
  entityId: string;
  entityName: string = 'Negotiation';
  rowData_grid: any[];
  documentTypeListForSearch: any;
  responseList: any;
  selectedDocumentType: any;
  appErrorHandler: any;
  file: File;
  searchDocumentTypeModel: any = null;
  documentTypePopUp: any;
  expandDocumentTypePopUp: boolean = false;
  filteredList: any;
  rowSelection: any;
  params: any;
  docNotes: any;

  @ViewChild('inputContent') inputContent: ElementRef;
  updateNotes: any;

  constructor(private commonApiService: CommonApiService, private route: ActivatedRoute, public dialog: MatDialog, private changeDetector: ChangeDetectorRef, private spinner: NgxSpinnerService, private toastr: ToastrService, private format: TenantFormattingService) {
    this.route.params.pipe().subscribe(params => {
      this.entityId = this.route.snapshot.params.requestId;
    });
    this.setupAgGrid();
    this.getDocumentTypeList();
  }

  getDocumentTypeList() {
    const payload = {
      Order: null,
      PageFilters: {
        Filters: []
      },
      SortList: {
        SortList: []
      },
      Filters: [
        {
          ColumnName: 'ReferenceNo',
          Value: this.entityId
        },
        {
          ColumnName: 'TransactionTypeId',
          Value: 48
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 9999
      }
    };
    this.commonApiService.getDocumentTypeList(payload).subscribe((response: any) => {
      if (typeof response === 'string') {
        this.toastr.error(response);
      } else {
        this.documentTypeListForSearch = _.cloneDeep(response);
        this.documentTypeList = _.cloneDeep(response);
        this.options = this.documentTypeList.map(x => x.displayName);
      }
    });
  }
  getDocumentsList() {
    const payload = {
      Order: null,
      PageFilters: {
        Filters: []
      },
      SortList: {
        SortList: []
      },
      Filters: [
        {
          ColumnName: 'ReferenceNo',
          Value: this.entityId
        },
        {
          ColumnName: 'TransactionTypeId',
          Value: 48
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 9999
      }
    };
    this.spinner.show();
    this.commonApiService.getDocuments(payload).subscribe((response: any) => {
      if (typeof response === 'string') {
        this.spinner.hide();
        this.toastr.error(response);
      } else {
        this.spinner.hide();
        this.responseList = _.cloneDeep(response);
        for (let i = 0; i < this.responseList.length; i++) {
          this.responseList[i].uploadedOn = this.format.date(this.responseList[i].uploadedOn);

          this.responseList[i].verifiedOn = this.format.date(this.responseList[i].verifiedOn);
          this.responseList[i].status = this.responseList[i].isVerified ? 'Verified' : 'Unverified';
        }
        this.rowData_grid = _.cloneDeep(this.responseList);
        this.commonApiService.shared_rowData_grid = this.gridOptions_data;
        this.changeDetector.detectChanges();
      }
    });
  }
  displayFn(documentType): string {
    return documentType && documentType.name ? documentType.name : '';
  }
  radioDocumentTypeChange($event: MatRadioChange) {
    if ($event.value) {
      this.selectedDocumentType = {...$event.value};
      this.documentType = null;
      this.enableUpload(this.selectedDocumentType);
      this.changeDetector.detectChanges();
    }
  }
  resetDocumentData() {
    this.searchDocumentTypeModel = null;
    this.documentTypePopUp = null;
    this.documentTypeListForSearch = _.cloneDeep(this.documentTypeList);
    this.expandDocumentTypePopUp = false;
  }
  searchDocumentTypeList(value: string): void {
    let filterDocumentType = this.documentTypeList.filter(documentType => documentType.name.toLowerCase().includes(value.trim().toLowerCase()));
    this.documentTypeListForSearch = [...filterDocumentType];
  }
  selectDocumentType(event: MatAutocompleteSelectedEvent) {
    this.selectedDocumentType = event.option.value;
  }
  public filterDocumentTypeList() {
    if (this.selectedDocumentType) {
      const filterValue = this.selectedDocumentType.name ? this.selectedDocumentType.name : this.selectedDocumentType;
      if (this.documentTypeList) {
        this.filteredList = this.documentTypeList.filter((item: any) => item.name.toLowerCase().includes(filterValue.trim().toLowerCase())).splice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  setupAgGrid() {
    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true
      },
      columnDefs: this.columnDef_grid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      rowSelection: 'multiple',
      animateRows: false,
      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_grid);
      },
      onColumnResized: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  files: any[] = [];
  public doc_type;

  public enableFileUpload: boolean = false;
  public enableDrag: boolean = false;
  enableUpload(e) {
    this.selectedDocumentType = e;
    this.doc_type = e.name;
    this.enableFileUpload = true;
    this.enableDrag = true;
  }

  /**
   * on file drop handler
   */
  onFileDropped(files) {
    this.upload(files[0]);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.upload(files[0]);
  }
  upload(event) {
    if (!this.selectedDocumentType) {
      //which values is coming emty

      this.appErrorHandler.handleError(ModuleError.DocumentTypeNotSelected);
      this.clearUploadedFiles();
    } else {
      this.file = event;
      const requestPayload: IDocumentsCreateUploadDto = {
        Payload: <IDocumentsCreateUploadDetailsDto>{
          name: event.name,
          documentType: {
            id: this.selectedDocumentType.id,
            name: this.selectedDocumentType.name
          },
          size: event.size,
          fileType: event.type,
          referenceNo: parseFloat(this.entityId),
          transactionType: {
            id: 48
          }
        }
      };
      if (event.type.includes('mp4')) {
        this.clearUploadedFiles();
        this.toastr.error('File type Mp4 is not supported!');
        return;
      }
      const formRequest: FormData = new FormData();
      formRequest.append('file', event);
      formRequest.append('request', JSON.stringify(requestPayload));
      this.spinner.show();

      this.commonApiService.uploadFile(formRequest).subscribe(response => {
        if (typeof response == 'string') {
          this.spinner.hide();
          this.toastr.error(response);
        } else {
          this.spinner.hide();
          this.toastr.success('Document saved !');
          this.getDocumentsList();
        }
      });

      this.clearUploadedFiles();
    }
  }
  clearUploadedFiles(): void {
    this.inputContent.nativeElement.value = '';
    this.selectedDocumentType = null;
    this.file = null;
  }
  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  private columnDef_grid = [
    {
      headerName: '',
      field: 'check',
      filter: true,
      suppressMenu: true,
      width: 20,
      checkboxSelection: true,
      resizable: false,
      suppressMovable: true,
      cellRendererFramework: AGGridCellActionsDocumentsComponent,
      cellRendererParams: { type: 'row-remove-icon-with-checkbox' },
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass: 'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center'
    },
    {
      headerName: 'Document Name',
      headerTooltip: 'Document Name',
      field: 'name',
      width: 150,
      cellRendererFramework: AGGridCellActionsDocumentsComponent,
      cellRendererParams: { type: 'document-name-download' }
    },
    {
      headerName: 'Size',
      headerTooltip: 'Size',
      field: 'size',
      width: 100,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Document Type',
      headerTooltip: 'Document Type',
      field: 'documentType.name',
      width: 100,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'File Type',
      headerTooltip: 'File Type',
      field: 'fileType',
      width: 100,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Entity',
      headerTooltip: 'Entity',
      field: 'transactionType.name',
      width: 100,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Reference No.',
      headerTooltip: 'Reference No.',
      field: 'referenceNo',
      width: 125,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Uploaded by',
      headerTooltip: 'Uploaded By',
      field: 'uploadedBy.name',
      width: 150,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Uploaded On',
      headerTooltip: 'Uploaded On',
      field: 'uploadedOn',
      width: 120,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Status',
      headerTooltip: 'Status',
      field: 'status',
      width: 150,
      headerClass: ['document-status'],
      cellRendererFramework: AGGridCellV2RendererComponent,
      cellClass: ['aggridtextalign-center', 'document-status'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass = params.value === 'Verified' ? 'custom-chip medium-green' : params.value === 'Unverified' ? 'custom-chip medium-amber' : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null, type: 'chip-lightTooltip', label: 'lightTooltip' };
      }
    },
    {
      headerName: 'Verified By',
      headerTooltip: 'Verified By',
      field: 'verifiedBy.name',
      width: 100,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Verified On',
      headerTooltip: 'Verified On',
      field: 'verifiedOn',
      width: 120,
      cellRendererFramework: AGGridCellV2RendererComponent
    },
    {
      headerName: 'Add Views/Notes',
      headerTooltip: 'Add Views/Notes',
      field: 'notes',
      width: 200,
      cellRendererFramework: AGGridCellActionsDocumentsComponent,
      cellRendererParams: { type: 'dashed-border-notes' }
    },
    {
      headerName: 'Download',
      suppressMenu: true,
      sortable: false,
      width: 100,
      headerTooltip: 'Download',
      field: 'download',
      headerClass: ['pd-0'],
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsDocumentsComponent,
      cellRendererParams: { type: 'download' }
    }
  ];
}
