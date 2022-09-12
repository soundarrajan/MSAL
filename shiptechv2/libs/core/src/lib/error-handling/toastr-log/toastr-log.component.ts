import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { AppContext } from '../../app-context/app-context';

// NOTE: This selector must be as it is below otherwise toastr component won't accept it
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-toastr-log]',
  template: `
    <button
      *ngIf="options.closeButton"
      (click)="remove()"
      class="toast-close-button"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
    <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
      {{ title }}
    </div>
    <div
      role="alertdialog"
      aria-live="polite"
      [class]="options.messageClass"
      [attr.aria-label]="message"
    >
      {{ message }}
    </div>
    <div style="font-size: 10px; color: white;">tracking-id</div>
    <div
      *ngIf="message && options.enableHtml"
      class="form-inline"
      role="alertdialog"
      aria-live="polite"
      style="font-size: 13px; color: white"
    >
      <input
        matInput
        readonly
        class="form-control toastr-copy-input"
        type="text"
        [value]="appContext.sessionId"
      />
      <button
        type="button"
        class="toastr-copy-button cursor-pointer"
        matTooltip="Click to copy"
        [appToClipboard]="appContext.sessionId"
        [propertyName]="title"
      >
        <mat-icon class="toastr-copy-icon">file_copy</mat-icon>
      </button>
    </div>
    <div
      *ngIf="message && !options.enableHtml"
      role="alertdialog"
      aria-live="polite"
      [class]="options.messageClass"
      [attr.aria-label]="message"
    ></div>
    <div *ngIf="options.progressBar">
      <div class="toast-progress" [style.width]="width + '%'"></div>
    </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate('{{ easeTime }}ms {{ easing }}')
      ),
      transition('active => removed', animate('{{ easeTime }}ms {{ easing }}'))
    ])
  ],
  preserveWhitespaces: false,
  styleUrls: ['./toastr-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastrLogComponent extends Toast {
  constructor(
    public appContext: AppContext,
    public toastrService: ToastrService,
    public toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
    this.appContext = appContext || AppContext.instance;
  }
}
