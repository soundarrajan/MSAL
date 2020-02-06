import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompleteListGridViewModel } from './view-model/invoice-complete-list-grid.view-model';
import { Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';

@Component({
  selector: 'shiptech-invoice-complete-list',
  templateUrl: './feature-invoice.component.html',
  providers: [CompleteListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureInvoiceComponent implements OnInit, OnDestroy {

  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public gridViewModel: CompleteListGridViewModel,
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
