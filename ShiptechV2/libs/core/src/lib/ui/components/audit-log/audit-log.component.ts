import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import {AuditLogGridViewModel} from "./view-model/audit-log-grid-view-model.service";
import {Subject} from "rxjs";

@Component({
  selector: 'shiptech-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css'],
  providers: [AuditLogGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();
  private _businessId: number;
  private _entityTransactionType: string;

  get businessId(): number {
    return this._businessId;
  }
  get entityTransactionType(): string {
    return this._entityTransactionType;
  }

  @Input() set businessId(value: number) {
    this._businessId = value;
    this.gridViewModel.businessId = this.businessId;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  @Input() set entityTransactionType(value: string) {
    this._entityTransactionType = value;
    this.gridViewModel.entityTransactionType = this.entityTransactionType;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }
  constructor(public gridViewModel: AuditLogGridViewModel) {
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
