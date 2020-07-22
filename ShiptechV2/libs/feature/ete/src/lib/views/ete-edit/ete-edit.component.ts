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
  private _destroy$ = new Subject();

  constructor(public appConfig: AppConfig, public route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.templateId = params[KnownEteRoutes.templateIdParam];
    //   console.log("Test");
    //   console.log(params);
    // });

    this.templateId = this.route.snapshot.paramMap.get(
      KnownEteRoutes.templateIdParam
    );
    console.log('test');
    console.log(this.templateId);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
