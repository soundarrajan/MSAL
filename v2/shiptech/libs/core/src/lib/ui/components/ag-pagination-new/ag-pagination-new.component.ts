import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-pagination-new',
  templateUrl: './ag-pagination-new.component.html',
  styleUrls: ['./ag-pagination-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgPaginationNewComponent implements AfterViewInit {
  @Input() id: string;
  @Input() pagerLeftArrowIcon: string;
  @Input() pagerRightArrowIcon: string;
  @Input() pagerPreviousIcon: string;
  @Input() pagerNextIcon: string;
  @Input() useInputAsPageSelect: boolean;
  collection = [];

  @Input()
  set size(val: number) {
    this._size = val;
    this.pages = this.calcPages();
  }

  get size(): number {
    return this._size;
  }

  @Input()
  set count(val: number) {
    this._count = val;
    this.setCollection();
    this.pages = this.calcPages();
  }

  get count(): number {
    return this._count;
  }

  @Input()
  set page(val: number) {
    this._page = val;
    this.pages = this.calcPages();

    if (this.useInputAsPageSelect) {
      this.formControl.setValue(val, { emitEvent: false });
    }
  }

  get page(): number {
    return this._page;
  }

  get totalPages(): number {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  _count: number = 0;
  _page: number = 1;
  _size: number = 0;
  pages: any;
  formControl = new FormControl();

  canPrevious(): boolean {
    return this.page > 1;
  }

  canNext(): boolean {
    return this.page < this.totalPages;
  }

  prevPage(): void {
    this.selectPage(this.page - 1);
  }

  nextPage(): void {
    this.selectPage(this.page + 1);
  }

  selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      //TODO: Remove useInputAsPageSelect feature. This is called twice because of it
      this.page = page;

      this.pageChange.emit({
        page
      });
    }
  }

  calcPages(page?: number): any[] {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const maxSize = 5;
    const isMaxSized = maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: <string>(<any>num)
      });
    }

    return pages;
  }

  setCollection() {
    this.collection = [];
    for (let i = 1; i <= this.count; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngAfterViewInit(): void {
    if (this.useInputAsPageSelect) {
      this.formControl.valueChanges
        .pipe(
          distinctUntilChanged(),
          debounceTime(300),
          tap(this.selectPage.bind(this))
        )
        .subscribe();
    }
  }
}
