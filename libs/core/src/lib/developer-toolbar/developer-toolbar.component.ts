import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ApiServiceModel } from './api-service.model';
import { Router } from '@angular/router';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { UserSettingsApiServiceMock } from '@shiptech/core/services/user-settings/user-settings-api.service.mock';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { ServiceStatusesEnum } from '@shiptech/core/developer-toolbar/api-service-settings/service-statuses.enum';

@Component({
  selector: 'app-developer-toolbar',
  templateUrl: './developer-toolbar.component.html',
  styleUrls: ['./developer-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeveloperToolbarComponent implements OnInit, OnDestroy {
  apiServices: ApiServiceModel[];
  reset$ = new Subject();
  displayedServiceIndex: number = 0;

  keepSettings: boolean;
  private _destroy$ = new Subject();
  private devApiBase;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
    private devService: DeveloperToolbarService,
    private userSettingsApiServiceMock: UserSettingsApiServiceMock
  ) {

    this.devService.apiServices$.pipe(
      tap(services => this.apiServices = services),
      takeUntil(this._destroy$)
    ).subscribe();

    this.keepSettings = this.devService.shouldKeepSettings();
  }

  ngOnInit(): void {
  }

  /**
   * Adds current dev settings in Storage or removes it.
   * @param checkboxChange
   */
  changeKeepSettings(value: boolean): void {
    this.keepSettings = value;

    if (!value) {
      this.devService.purgeApiSettings();
    }
  }

  // /**
  //  * Reset settings to original settings when component loaded. Usually these are the actual settings set via @ApiCall decorator
  //  */
  public resetSettings(): void {
    this.reset$.next();
  }

  public purgePreferences(): void {
    this.userSettingsApiServiceMock
      .removeAll()
      .pipe(finalize(() => window.location.reload()))
      .subscribe();
  }

  public openDialog(content: TemplateRef<any>): void {
    this.dialog.open(content, {
      height: '700px',
      width: '1000px'
    });
  }

  allUseReal(): boolean {
    return this.apiServices.filter(s => !!s.component).every(s => s.component.getServiceStatus() === ServiceStatusesEnum.Real);
  }

  refreshRoute(): void {
    const currentRoute = this.router.url;

    if (currentRoute === '/') {
      return;
    }

    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => {
        this.router.navigateByUrl(currentRoute);
      }, 500);
    });
  }

  ngOnDestroy(): void {
    this.reset$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
