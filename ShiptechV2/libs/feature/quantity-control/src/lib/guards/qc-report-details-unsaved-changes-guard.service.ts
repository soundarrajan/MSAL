import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { QcReportDetailsComponent } from '../views/qc-report/details/qc-report-details.component';
import { Observable, Observer, of } from 'rxjs';
import { QcReportDetailsService } from '../services/qc-report-details.service';
import { Store } from '@ngxs/store';
import { QcReportState } from '../store/report-view/qc-report.state';
import { ConfirmationService } from 'primeng/api';

@Injectable()
export class QcReportDetailsUnsavedChangesGuard implements CanDeactivate<QcReportDetailsComponent> {
  constructor(private detailsService: QcReportDetailsService, private store: Store, private confirmationService: ConfirmationService) {
  }

  canDeactivate(
    component: QcReportDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasUnsavedChanges = this.store.selectSnapshot(QcReportState.hasUnsavedChanges);

    if (hasUnsavedChanges) {
      return new Observable((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          message: 'You have unsaved changed. Do you want to discard changes?',
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
      });
    }

    return of(true);
  }
}
