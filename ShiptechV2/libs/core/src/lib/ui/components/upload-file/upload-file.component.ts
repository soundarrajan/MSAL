import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileComponent implements OnInit, OnDestroy {
  @Input() value: any;
  @Input() placeholder: string;
  @Output() valueChanged = new EventEmitter<string>();

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
