import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() placeholder: string;
  @Output() search = new EventEmitter<string>();

  searchTextField = new FormControl();

  private _destroy$: Subject<any> = new Subject();

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(value => this.search.emit(value)),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngOnInit(): void {}

  onSearch(): void {
    this.search$.next(this.searchTextField.value?this.searchTextField.value:'');
  }

  clear(): void {
    this.searchTextField.setValue('');

    this.onSearch();
  }

  ngOnDestroy(): void {
    this.search$.complete();

    this._destroy$.next();
    this._destroy$.complete();
  }
}
