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

  collection = [];

  @Input() gridViewModel;

  @Input() serverKeys;
  @Input() enabler: boolean = false;
  @Input() rowCount;
  @Input() maxSize;
  @Input() doublePagination;
  @Input() dualfooter;
  @Input() singleGrid;
  @Input() id: string;
  @Input() footerWidth;
  @Input() footerPosition;
  @Input() showFooterDatepicker;
  @Input() display: boolean = true;
  @Input() exportDisplay: boolean = false;

  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  @Output() newPageSize: EventEmitter<any> = new EventEmitter();

  @Output() exportClick: EventEmitter<any> = new EventEmitter();

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

  constructor() {
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  onPageChange(page: number): void {
    this.pageChange.emit({
      page
    });
  }

  onPageSizeChanged(pageSize: number) {
    this.newPageSize.emit({ pageSize });
  }

  onPageSizeChange(pageSize: number): void {
    if (this.gridViewModel)
      this.gridViewModel.pageSize = pageSize;
    this.newPageSize.emit({ pageSize });
  }

  pageChanged(e) {
    this.page = e;
    //console.(e);
    //this.pageChange.emit(event)
  }

  export(type) {
    this.exportClick.emit(type);
  }
}
