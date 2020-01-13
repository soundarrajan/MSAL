import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { EmailLogsGridViewModel } from "./view-model/email-logs-grid-view-model.service";
import { Subject } from "rxjs";

@Component({
  selector: "shiptech-email-log",
  templateUrl: "./email-log.component.html",
  styleUrls: ["./email-log.component.css"],
  providers: [EmailLogsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailLogComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _transactionTypeId: number;
  private _transactionIds: string;

  get transactionTypeId(): number {
    return this._transactionTypeId;
  }
  get transactionIds(): string {
    return this._transactionIds;
  }

  @Input() set transactionTypeId(value: number) {
    this._transactionTypeId = value;
    this.gridViewModel.transactionTypeId = this.transactionTypeId;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  @Input() set transactionIds(value: string) {
    this._transactionIds = value;
    this.gridViewModel.transactionIds = this.transactionIds;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  constructor(public gridViewModel: EmailLogsGridViewModel) {
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
