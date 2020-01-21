import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'shiptech-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<any> = new Subject();


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this._destroy$.next();
    this._destroy$.complete();
  }
}
