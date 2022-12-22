import { 
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChildren,
  QueryList,
  Host,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';
import { CommonService } from '@shiptech/core/services/common/common-service.service'
import _ from 'lodash';
import { SearchLocationPopupComponent } from '../search-location-popup/search-location-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dark-selection-menu',
  templateUrl: './dark-selection-menu.component.html',
  styleUrls: ['./dark-selection-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkSelectionMenuComponent implements OnInit {

  @ViewChildren(MatOption) protected options: QueryList<MatOption>;
  @Input('dataSource') _dataSource$: Observable<any[]>;
  @Input('value') selectedItem: any = '';
  @Input('columnSource') columnSource: any[];
 
  @Output() onSelectionChange = new EventEmitter();
  @Output() closed = new EventEmitter();

  dataSource: any[] = [];
  dataSourceCopy: any[] = [];
  columnKeys: any[] = [];
  expandLocation: boolean = false;
  searchText = "";
  
  constructor(
    @Host() private select: MatSelect,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
       if(this.dataSource.length === 0 && this.columnSource.length > 0) {
      let _temp = {};
      this.columnSource.forEach(column => {
        this.columnKeys.push(column.propName);
        _temp[column.propName] = "";
      });
      this.dataSource.push(_temp);
    }
  }

  ngOnChanges(change): void {
    if(change._dataSource$){
      change._dataSource$.currentValue.subscribe(item => {
        this.dataSourceCopy = _.cloneDeep(item.sort((a, b) => a.name.localeCompare(b.name)));
        this.dataSource = _.cloneDeep(item.sort((a, b) => a.name.localeCompare(b.name)));
        this.dataSource = this.dataSource.splice(0, 10);
        this.initOptions();
      });
    }
  }

  /**
   * Call the init method to init the options
   * This method must be called on the AfterViewInit life cycle
   *
   * This method must be call only Once
   */
   protected initOptions(): void {
    // the observable is complete on destroy
    this.options.changes.subscribe(options =>
      this.registerSelectOptions(this.select, options)
    );
    this.registerSelectOptions(this.select, this.options);
  }

  /**
   * This method can be called to manually register options
   * @param select MatSelect instance
   * @param options options to add
   */
  protected registerSelectOptions(select: MatSelect | MatAutocomplete,
  options: QueryList<MatOption>): void {
    // reset the option in select
    if(select && select.options !== undefined){
      select.options.reset([
        ...select.options.toArray(), // existing option
        ...options.toArray() // new options
      ]
      );
      // notify the select that options have changed
      select.options.notifyOnChanges();
      this.cd.detectChanges();
    }
  }

  private _filter(value: string) {
    if(value!=''){
      const filterValue = value.toLowerCase();
      var dataSrc = _.cloneDeep(this.dataSourceCopy);
      var recordsSorted = [];
      var _tempArr = [];
      this.columnKeys.forEach(col => {
          _tempArr = [];
          _tempArr.push(dataSrc.filter(option => {
            return (option[col] && option[col].toString().toLowerCase().includes(filterValue));
          }).sort((a, b) => a.name.localeCompare(b.name)));
          recordsSorted = (_tempArr.length > 0 ) ? [...recordsSorted, ..._tempArr[0]] : recordsSorted;
      });
      return recordsSorted;
    }
    else{
      return this.dataSourceCopy;
    }
  }

  onItemSelectionChange(item) {
    this.selectedItem = item.id;
    this.onSelectionChange.emit(item);
    this.selectedItem = '';
    this.searchText = "";
    this.dataSource = _.cloneDeep(this.dataSourceCopy).splice(0, 10);
  }

  search(value: string): void {
    this.dataSource = _.cloneDeep(this._filter(value)).splice(0, 10);
  }

  openLocationLookup() {
    const dialogRef = this.dialog.open(SearchLocationPopupComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result?.data){
        this.onSelectionChange.emit(result.data);
      }
      this.closed.emit(true);
    });
  }

  isChecked(elId) { return (elId === this.selectedItem)?true:false }
}
