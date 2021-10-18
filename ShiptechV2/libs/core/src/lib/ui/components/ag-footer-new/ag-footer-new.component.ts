import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-footer-new',
  templateUrl: './ag-footer-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgFooterNewComponent {
  _count: number = 0;
  _page: number = 1;
  _size: number = 0;

  @Input() gridViewModel;

  @Input() rowCount;
  @Input() maxSize;
  @Input() doublePagination;
  @Input() dualfooter;
  @Input() singleGrid;
  @Input() id: string;
  @Input() footerWidth;
  @Input() footerPosition;
  @Input() showFooterDatepicker;

  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  @Input()
  set size(val: number) {
    this._size = val;
  }

  get size(): number {
    return this._size;
  }

  @Input()
  set count(val: number) {
    this._count = val;
  }

  get count(): number {
    return this._count;
  }

  @Input()
  set page(val: number) {
    this._page = val;
  }

  get page(): number {
    return this._page;
  }

  get totalPages(): number {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  onPageChange(page: number): void {
    this.pageChange.emit({
      page
    });
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }
}
