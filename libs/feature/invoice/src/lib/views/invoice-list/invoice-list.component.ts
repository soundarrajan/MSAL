import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {AppConfig} from '@shiptech/core/config/app-config';
import {ReconStatusLookup} from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import {InvoiceListGridViewModel} from "./view-model/invoice-list-grid-view-model.service";

@Component({
  selector: 'shiptech-invoice-list',
  templateUrl: './invoice-list.component.html',
  providers: [InvoiceListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListComponent implements OnInit, OnDestroy {

  @ViewChild('popup', {static: false}) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public gridViewModel: InvoiceListGridViewModel,
              public appConfig: AppConfig,
              public reconStatusLookups: ReconStatusLookup
  ) {
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
