import { AfterContentChecked, Directive, ElementRef, EventEmitter, HostListener, Input, NgZone, OnChanges, OnDestroy, Output } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

const MAX_LOOKUP_RETRIES = 3;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[autosize]'
})

export class AutosizeDirective implements OnDestroy, OnChanges, AfterContentChecked {
  @Input() minRows: number;
  @Input() maxRows: number;
  @Input() onlyGrow = false;
  @Input() useImportant = false;

  @Output() autosize = new EventEmitter<number>();

  private retries = 0;
  private textAreaEl: any;

  private _oldContent: string;
  private _oldWidth: number;

  private _destroyed$ = new ReplaySubject(1);

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  constructor(
    public element: ElementRef,
    private _zone: NgZone
  ) {
    if (this.element.nativeElement.tagName !== 'TEXTAREA') {
      this.findNestedTextArea();

    } else {
      this.textAreaEl = this.element.nativeElement;
      this.textAreaEl.style.overflow = 'hidden';
      this.onTextAreaFound();
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }

  ngAfterContentChecked(): void {
    this.adjust();
  }

  ngOnChanges(changes: any): void {
    this.adjust(true);
  }

  private findNestedTextArea(): void {
    this.textAreaEl = this.element.nativeElement.querySelector('TEXTAREA');

    if (!this.textAreaEl && this.element.nativeElement.shadowRoot) {
      this.textAreaEl = this.element.nativeElement.shadowRoot.querySelector('TEXTAREA');
    }

    if (!this.textAreaEl) {
      if (this.retries >= MAX_LOOKUP_RETRIES) {
        console.warn('ngx-autosize: textarea not found');

      } else {
        this.retries++;
        setTimeout(() => {
          this.findNestedTextArea();
        }, 100);
      }
      return;
    }

    this.textAreaEl.style.overflow = 'hidden';
    this.onTextAreaFound();

  }

  private onTextAreaFound(): void {
    this._zone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          takeUntil(this._destroyed$)
        )
        .subscribe(() => {
          this._zone.run(() => {
            this.adjust();
          });
        });
    });
    setTimeout(() => {
      this.adjust();
    });
  }

  adjust(inputsChanged: boolean = false): void {
    if (this.textAreaEl) {

      const currentText = this.textAreaEl.value;

      if (
        inputsChanged === false &&
        currentText === this._oldContent &&
        this.textAreaEl.offsetWidth === this._oldWidth
      ) {
        return;
      }

      this._oldContent = currentText;
      this._oldWidth = this.textAreaEl.offsetWidth;

      const clone = this.textAreaEl.cloneNode(true);
      const parent = this.textAreaEl.parentNode;
      clone.style.width = this.textAreaEl.offsetWidth + 'px';
      clone.style.visibility = 'hidden';
      clone.style.position = 'absolute';
      clone.textContent = currentText;

      parent.appendChild(clone);

      clone.style.overflow = 'auto';
      clone.style.height = 'auto';

      let height = clone.scrollHeight;

      // add into height top and bottom borders' width
      const computedStyle = window.getComputedStyle(clone, null);
      height += parseInt(computedStyle.getPropertyValue('border-top-width'), 10);
      height += parseInt(computedStyle.getPropertyValue('border-bottom-width'), 10);

      const willGrow = height > this.textAreaEl.offsetHeight;

      if (this.onlyGrow === false || willGrow) {
        const lineHeight = this.getLineHeight();
        const rowsCount = height / lineHeight;

        if (this.minRows && this.minRows >= rowsCount) {
          height = this.minRows * lineHeight;

        } else if (this.maxRows && this.maxRows <= rowsCount) {
          height = this.maxRows * lineHeight;
          this.textAreaEl.style.overflow = `auto`;

        } else {
          this.textAreaEl.style.overflow = `hidden`;
        }
        height-=5; //TODO
        this.textAreaEl.style.height = `${height}px${this.useImportant ? '!important;' : ''}`;

        this.autosize.next(height);
      }

      parent.removeChild(clone);
    }
  }

  private getLineHeight(): number {
    let lineHeight = parseInt(this.textAreaEl.style.lineHeight, 10);
    if (isNaN(lineHeight) && window.getComputedStyle) {
      const styles = window.getComputedStyle(this.textAreaEl);
      lineHeight = parseInt(styles.lineHeight, 10);
    }

    if (isNaN(lineHeight)) {
      const fontSize = window.getComputedStyle(this.textAreaEl, null).getPropertyValue('font-size');
      lineHeight = Math.floor(parseInt(fontSize.replace('px', ''), 10) * 1.5);
    }

    return lineHeight;
  }
}
