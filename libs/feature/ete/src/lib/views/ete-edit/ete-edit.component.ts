import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ActivatedRoute } from '@angular/router';
import { KnownEteRoutes } from '../../known-ete.routes';

@Component({
  selector: 'shiptech-ete-edit',
  templateUrl: './ete-edit.component.html',
  styleUrls: ['./ete-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EteEditComponent implements OnInit, OnDestroy {
  public templateId = '';
  public serverUrl = '';

  private _destroy$ = new Subject();

  constructor(public appConfig: AppConfig, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.serverUrl = this.appConfig.v1.API.BASE_URL;
    this.templateId = this.route.snapshot.paramMap.get(
      KnownEteRoutes.templateIdParam
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
