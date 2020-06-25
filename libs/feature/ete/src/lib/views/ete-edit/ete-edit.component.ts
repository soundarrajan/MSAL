import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AppConfig} from '@shiptech/core/config/app-config';

@Component({
  selector: 'shiptech-ete-edit',
  templateUrl: './ete-edit.component.html',
  styleUrls: ['./ete-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EteEditComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  constructor(
    public appConfig: AppConfig
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
