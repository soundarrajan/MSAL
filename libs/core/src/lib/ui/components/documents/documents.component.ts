import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { DocumentsGridViewModel } from "./view-model/documents-grid-view-model.service";
import {IVesselMasterDto} from "@shiptech/core/services/masters-api/request-response-dtos/vessel";
import {fromLegacyLookup} from "@shiptech/core/lookups/utils";
import {QcReportService} from "../../../../../../feature/quantity-control/src/lib/services/qc-report.service";

@Component({
  selector: "shiptech-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
  providers: [DocumentsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _entityId: number;
  private _entityName: string;

  get entityId(): number {
    return this._entityId;
  }
  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    this.gridViewModel.entityId = this.entityId;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  constructor(public gridViewModel: DocumentsGridViewModel, private reportService: QcReportService) {
  }

  updateVessel(newVessel: IVesselMasterDto): void {
    this.reportService.updateVessel$(fromLegacyLookup(newVessel)).subscribe();
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  uploadHandlerDocuments(event: any):void {
    console.log(event);
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
