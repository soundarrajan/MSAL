import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalService } from '../../../../services/local-service.service';
import { AvailableFiltersPreferencesComponent } from '@shiptech/core/ui/components/designsystem-v2/dialog-popup/available-filters-preferences/available-filters-preferences.component';

@Component({
  selector: 'app-more-filter-chip',
  templateUrl: './more-filter-chip.component.html',
  styleUrls: ['./more-filter-chip.component.css']
})
export class MoreFilterChipComponent implements OnInit {
  @Input('filterList') filterList;
  @Input('switchTheme') switchTheme?;
  @Output() updateFilter = new EventEmitter();
  public theme = true;

  constructor(public dialog: MatDialog, private localService: LocalService) { }

  ngOnInit(): void {
    this.localService.themeChange.subscribe(data => {
      this.theme  = data;
    })
  }
  openAvailableFilter() {



    const dialogRef = this.dialog.open(AvailableFiltersPreferencesComponent, {
      data: this.filterList,
      width: '592px',
      minHeight: '138px',
      maxHeight: '600px',
      //panelClass: ['available-filters-preferences']
      panelClass: this.theme ? ['available-filters-preferences','dark-theme'] : ['available-filters-preferences','light-theme']
    });

    dialogRef.afterClosed().subscribe(result => {
      //Update the filters on saving the changes made and closing the popup
      if (result)//Popup got closed manually
        this.updateFilter.emit(result);
      else {//Popup got closed when clicked in the backdrop
        let res = dialogRef.componentInstance.data.filter((element) => !element["deleted"] || element["deleted"] != true)
        //this.updateFilter.emit(res);
      }
    });
  }
}
