import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { QcReportDetailsComponent } from '../views/qc-report/details/qc-report-details.component';
import { Observable, Observer, of } from 'rxjs';
import { QcReportService } from '../services/qc-report.service';
import { Store } from '@ngxs/store';
import { QcReportState } from '../store/report/qc-report.state';
import { ConfirmationService } from 'primeng/primeng';

@Injectable()
export class QcReportDetailsUnsavedChangesGuard implements CanDeactivate<QcReportDetailsComponent> {
  constructor(private detailsService: QcReportService, private store: Store, private confirmationService: ConfirmationService) {
  }

  canDeactivate(
    component: QcReportDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasChanges = this.store.selectSnapshot(QcReportState.hasChanges);

    if (hasChanges) {
      return new Observable((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          message: 'You have unsaved changes. Do you want to discard changes?',
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
