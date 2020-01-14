import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { EmailLogsGridViewModel } from "./view-model/email-logs-grid-view-model.service";
import { Subject } from "rxjs";

@Component({
  selector: "shiptech-email-log",
  templateUrl: "./email-log.component.html",
  styleUrls: ["./email-log.component.scss"],
  providers: [EmailLogsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailLogComponent implements OnInit, OnDestroy {

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
