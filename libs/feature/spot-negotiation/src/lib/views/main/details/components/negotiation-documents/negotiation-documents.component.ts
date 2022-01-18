import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererComponent } from '../../../../../core/ag-grid/ag-grid-cell-renderer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import _ from 'lodash';
import { MatRadioChange } from '@angular/material/radio';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FileUpload } from 'primeng/fileupload';
import {
  IDocumentsCreateUploadDetailsDto,
  IDocumentsCreateUploadDto
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { ModuleError } from './error-handling/module-error';

@Component({
  selector: 'app-negotiation-documents',
  templateUrl: './negotiation-documents.component.html',
  styleUrls: ['./negotiation-documents.component.css']
})
export class NegotiationDocumentsComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadComponent', { static: false }) uploadedFiles: FileUpload;

  public gridOptions_data: GridOptions;
  documentTypeList: any[];
  documentType: any = null;
  expandDocumentTypePopUp: boolean = false;
  searchDocumentTypeModel: any = null;
  selectedDocumentType: any = null;
  documentTypeListForSearch: any[];
  file: File;
  entityName: string = 'Negotiation';
  entityId: string;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    private router: Router,
    private toastr: ToastrService,
    private appErrorHandler: AppErrorHandler
  ) {
    this.route.params.pipe().subscribe(params => {
      this.entityId = params.spotNegotiationId;
    });

    this.getDocumentTypeList();
    this.setupAgGrid();
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
          Value: this.entityId.toString()
        },
        {
          ColumnName: 'TransactionTypeId',
          Value: 2
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 9999
      }
    };
    this.spinner.show();
    this.spotNegotiationService
      .getDocumentTypeList(payload)
      .subscribe((response: any) => {
        if (typeof response === 'string') {
          this.spinner.hide();
          this.toastr.error(response);
        } else {
          this.spinner.hide();
          console.log(response);
          this.documentTypeListForSearch = _.cloneDeep(response);
          this.documentTypeList = _.cloneDeep(response);
        }
      });
  }

  displayFn(documentType): string {
    return documentType && documentType.name ? documentType.name : '';
  }

  radioDocumentTypeChange($event: MatRadioChange) {
    if ($event.value) {
      this.selectedDocumentType = $event.value;
      console.log(this.selectedDocumentType);
    }
  }

  searchDocumentTypeList(value: string): void {
    let filterDocumentType = this.documentTypeList.filter(documentType =>
      documentType.name.toLowerCase().includes(value.trim().toLowerCase())
    );
    console.log(filterDocumentType);
    this.documentTypeListForSearch = [...filterDocumentType];
  }

  selectDocumentType(event: MatAutocompleteSelectedEvent) {
    this.selectedDocumentType = event.option.value;
    console.log(this.selectedDocumentType);
  }

  public filterDocumentTypeList() {
    if (this.selectedDocumentType) {
      const filterValue = this.selectedDocumentType.name
        ? this.selectedDocumentType.name
        : this.selectedDocumentType;
      if (this.documentTypeList) {
        const list = this.documentTypeList
          .filter((item: any) =>
            item.name.toLowerCase().includes(filterValue.trim().toLowerCase())
          )
          .splice(0, 10);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  clearUploadedFiles(): void {
    this.uploadedFiles.clear();
  }

  ngAfterViewInit(): void {
    this.uploadedFiles.uploadHandler.subscribe((event: FileUpload) => {
      console.log(this.selectedDocumentType);
      if (!this.selectedDocumentType) {
        this.appErrorHandler.handleError(ModuleError.DocumentTypeNotSelected);
        this.clearUploadedFiles();
      } else {
        this.file = event.files[0];
        console.log(this.file);
        const requestPayload: IDocumentsCreateUploadDto = {
          Payload: <IDocumentsCreateUploadDetailsDto>{
            name: event.files[0].name,
            documentType: {
              id: this.selectedDocumentType.id,
              name: this.selectedDocumentType.name
            },
            size: event.files[0].size,
            fileType: event.files[0].type,
            referenceNo: parseFloat(this.entityId),
            transactionType: {
              id: 2,
              name: 'Offer'
            }
          }
        };
        const formRequest: FormData = new FormData();
        formRequest.append('file', event.files[0]);
        formRequest.append('request', JSON.stringify(requestPayload));

        this.spotNegotiationService.uploadFile(formRequest).subscribe(
          () => {
            this.toastr.success('Document saved !');
          },
          () => {
            this.appErrorHandler.handleError(ModuleError.UploadDocumentFailed);
          }
        );

        this.clearUploadedFiles();
        this.selectedDocumentType = undefined;
      }
    });
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
      animateRows: false,
      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        // this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_grid);
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
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

  ngOnInit() {}

  uploadDocument(doc, doctype) {
    var lastfile = doc[doc.length - 1];
    var file = lastfile.name.split('.');
    let filename = file[0];
    let fileformat = file[1].toUpperCase();
    this.gridOptions_data.api.applyTransaction({
      add: [
        {
          doc_name: filename,
          size: '199KB',
          doc_type: 'Contract',
          file_type: doctype,
          entity: 'Contract',
          ref_no: '123678',
          uploaded_by: 'Alexander',
          uploaded_on: '12/11/20',
          status: 'Verified',
          verified_by: 'Yusuf',
          add_views: 'Document uploaded',
          download: ''
        }
      ]
    });
  }

  private columnDef_grid = [
    /* {
      resizable: false,
      width: 20,
      suppressMenu: true,
      headerClass: ['aggridtextalign-center'],
      headerName: "",
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    }, */
    {
      headerName: '',
      field: 'check',
      filter: true,
      suppressMenu: true,
      width: 20,
      checkboxSelection: true,
      resizable: false,
      suppressMovable: true,
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'row-remove-icon-with-checkbox' },
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass:
        'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center'
    },
    {
      headerName: 'Document Name',
      headerTooltip: 'Document Name',
      field: 'doc_name',
      width: 150
    },
    { headerName: 'Size', headerTooltip: 'Size', field: 'size', width: 100 },
    {
      headerName: 'Document Type',
      headerTooltip: 'Document Type',
      field: 'doc_type',
      width: 100
    },
    {
      headerName: 'File Type',
      headerTooltip: 'File Type',
      field: 'file_type',
      width: 100
    },
    {
      headerName: 'Entity',
      headerTooltip: 'Entity',
      field: 'entity',
      width: 100
    },
    {
      headerName: 'Reference No.',
      headerTooltip: 'Reference No.',
      field: 'ref_no',
      width: 125
    },
    {
      headerName: 'Uploaded by',
      headerTooltip: 'Uploaded By',
      field: 'uploaded_by',
      width: 150
    },
    {
      headerName: 'Uploaded On',
      headerTooltip: 'Uploaded On',
      field: 'uploaded_on',
      width: 120
    },
    {
      headerName: 'Status',
      headerTooltip: 'Status',
      field: 'status',
      width: 150,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Verified'
            ? 'custom-chip medium-green'
            : params.value === 'Unverified'
            ? 'custom-chip medium-amber'
            : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Verified By',
      headerTooltip: 'Verified By',
      field: 'verified_by',
      width: 100
    },
    {
      headerName: 'Verified On',
      headerTooltip: 'Verified On',
      field: 'verified_on',
      width: 120
    },
    {
      headerName: 'Add Views/Notes',
      headerTooltip: 'Add Views/Notes',
      field: 'add_views',
      width: 200,
      cellRendererFramework: AGGridCellRendererV2Component,
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
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'download' }
    }
  ];

  private rowData_grid = [
    {
      doc_name: 'Sept contract',
      size: '199KB',
      doc_type: 'Contract',
      file_type: 'PDF',
      entity: 'Contract',
      ref_no: '123678',
      uploaded_by: 'Alexander',
      uploaded_on: '12/11/20',
      status: 'Verified',
      verified_by: 'Yusuf',
      verified_on: '12/11/20',
      add_views: 'Document uploaded',
      download: ''
    },
    {
      doc_name: 'Demo contract',
      size: '199KB',
      doc_type: 'BDN',
      file_type: 'PDF',
      entity: 'Contract',
      ref_no: '123678',
      uploaded_by: 'Reshma',
      uploaded_on: '12/11/20',
      status: 'Verified',
      verified_by: 'Yusuf',
      verified_on: '12/11/20',
      add_views: 'Document uploaded',
      download: ''
    },
    {
      doc_name: 'Demo contract',
      size: '199KB',
      doc_type: 'Invoice',
      file_type: 'PDF',
      entity: 'Contract',
      ref_no: '123678',
      uploaded_by: 'Reshma',
      uploaded_on: '12/11/20',
      status: 'Unverified',
      verified_by: 'Yusuf',
      verified_on: '12/11/20',
      add_views: 'Document uploaded',
      download: ''
    }
  ];
}
