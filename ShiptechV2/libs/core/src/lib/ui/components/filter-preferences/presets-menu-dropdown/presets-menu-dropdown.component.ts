import { Component, OnInit } from '@angular/core';
import { AgGridFilterPresetsService } from '../ag-filter-presets-service/ag-filter-presets.service';

@Component({
  selector: 'shiptech-presets-menu-dropdown',
  templateUrl: './presets-menu-dropdown.component.html',
  styleUrls: ['./presets-menu-dropdown.component.scss']
})
export class PresetsMenuDropdownComponent implements OnInit {

  constructor(private filterPresetsService: AgGridFilterPresetsService,) { }

  ngOnInit(): void {
  }


  createFilter(): void {
    this.filterPresetsService.openSaveAsDialog();
  }

  updateFilter(): void {
    this.filterPresetsService.emitUpdateFilterPreset();
  }

  exportExcel(): void {
    alert('Wait for it...')
  }

}
