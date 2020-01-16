import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {DocumentsGridViewModel} from "@shiptech/core/ui/components/documents/view-model/documents-grid-view-model.service";
import {DocumentTypeGridViewModel} from "@shiptech/core/ui/components/documents/document-type/view-model/document-type-grid-view-model.service";
import {Subject} from "rxjs";

@Component({
  selector: "shiptech-document-type",
  templateUrl: "./document-type.component.html",
  styleUrls: ["./document-type.component.scss"],
  providers: [DocumentTypeGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DocumentTypeComponent implements OnInit, OnDestroy {
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

  constructor(public gridViewModel: DocumentTypeGridViewModel) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
