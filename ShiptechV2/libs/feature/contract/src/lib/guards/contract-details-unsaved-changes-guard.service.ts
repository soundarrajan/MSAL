import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, Observer, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import { ContractDetailsComponent } from '../views/contract/details/contract-details.component';

@Injectable()
export class ContractDetailsUnsavedChangesGuard
  implements CanDeactivate<ContractDetailsComponent> {
  constructor(
    private store: Store,
    private confirmationService: ConfirmationService
  ) {}

  canDeactivate(
    component: ContractDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const hasChanges = false;

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
