import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalService } from '../../services/local-service.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'map-panel',
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.scss']
})
export class MapPanelComponent implements OnInit {

  @Input() isShowPanel: boolean;
  @Input('highIntensity') highIntensity: boolean;
  @Input('hidePanel') hidePanel: boolean;
  @Input('minZoomLimit') minZoomLimit: boolean;
  @Input('maxZoomLimit') maxZoomLimit: boolean;
  @Input('vesselList') vesselList;
  @Input('portList') portList;
  @Output() zoomInEvent = new EventEmitter();
  @Output() zoomOutEvent = new EventEmitter();
  @Output() showTableViewEvent = new EventEmitter();
  @Output() changeVessel = new EventEmitter();
  @Output() changePort = new EventEmitter();
  isPanelActive: boolean = false;
  advancedSearchToggle: boolean = false;

  public vList = [];
  public pList = [];
  public list = [];
  public displayClose: boolean;
  public enableVesselPortList: boolean = true;
  public filterList = [];
  public selectedValue = "";
  public isActiveVessel: boolean = true;
  public isActivePort: boolean = false;
  public selectedType = "";
  public theme:boolean = true;
  searchControl = new FormControl();
  filteredOptions: Observable<string[]>;
  toggleFlag: boolean;
  constructor(private localService: LocalService) { }

  ngOnInit() {
    // this.localService.getVesselsList().subscribe((res: any) => {
    //   this.vesselList = res;
    //   this.filterList = res;
    // });
    // this.localService.getCountriesList().subscribe(response => {
    //   this.portList = response;
    //   this.filterList = this.vesselList.concat(this.portList)
    // });
    this.localService.themeChange.subscribe(value => this.theme = value);
    this.searchControl.setValue("");
    this.selectedValue = "";
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      map(value => this._filter(value))
    );

  }
  ngOnChanges() {
    this.setVesselPortList();
  }

  changeTab(v, p) {
    this.isActiveVessel = v;
    this.isActivePort = p;
    if (v)
      this.list = this.vList;
    else
      this.list = this.pList;

  }
  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    if (filterValue == "")
      return;
    else
      return this.filterList.filter(option => (option.name.toLowerCase().indexOf(filterValue) > -1));
  }
  clearSearch() {
    this.searchControl.setValue('');
    this.displayClose = false;
    this.enableVesselPortList = true;
    this.changeTab(true, false);
    if (document.getElementById('vesselSearch')) {
      document.getElementById('vesselSearch').focus();
    }
  }

  onClickInput(vessel) {

    this.searchControl.setValue(vessel.value);
    if (this.searchControl.value.trim() != "") {
      this.displayClose = true;
      this.enableVesselPortList = false;
      this.toggleFlag = false;
    }
  }
  onKeyDown(trigger: MatAutocompleteTrigger, event) {
    if (event.keyCode != '13') {//If not on keyboard ENTER keycode
      this.displayClose = true;
      this.enableVesselPortList = false;
      this.toggleFlag = false;
    }
  }

  setVesselPortList() {
    this.filterList = [];
    this.list = [];
    //Make a list of vesselname and vessel ID
    this.vesselList.forEach(vessel => {
      this.filterList.push({ type: 'V', id: vessel.vesselId, name: vessel.vesselName });
      this.vList.push({ type: 'V', id: vessel.vesselId, name: vessel.vesselName });
      this.filterList.push({ type: 'V', id: vessel.vesselId, name: vessel.vesselName });
    });
    // this.vesselList.forEach(vessel => {
    //   this.filterList.push({ type: 'V', id: vessel.VesselIMONO, name: vessel.VesselIMONO });
    // });
    this.portList.forEach(port => {
      this.filterList.push({ type: 'P', id: port.locationId, name: port.locationName });
      this.pList.push({ type: 'P', id: port.locationId, name: port.locationName });
    });

  }
  onVesselSelected(event, trigger: MatAutocompleteTrigger) {
    this.selectedType = event.option.value.type;
    this.searchControl.setValue(event.option.value.id);
    this.selectedValue = this.searchControl.value;
    this.enableVesselPortList = true;
    this.changeTab(true, false);
    this.toggleFlag = false;
    this.displayClose = false;
    if (document.getElementById('vesselSearch')) {
      document.getElementById('vesselSearch').blur();
    }
    if (this.selectedType == 'V') {
      console.log(this.searchControl.value + '')
      let vessel = this.vesselList.filter(element => (element.vesselId == this.searchControl.value) ||
      (element.vesselName.toLowerCase() == this.searchControl.value.toString().toLowerCase()));
      if (vessel.length > 0) {
        this.changeVessel.emit(vessel[0]);
      }
    }
    else {
      let port = this.portList.filter(element => (element.locationId == this.searchControl.value));
      if (port.length > 0) {
        this.changePort.emit(port[0]);
      }
    }
    this.clearSearch();
    this.selectedValue="";
  }
  toggleVesselPortList(event, trigger: MatAutocompleteTrigger) {
    event.stopPropagation();
    //toggleFlag=false--->menu is already closed
    //toggleFlag=true--->menu is already open
    if (!this.toggleFlag) {
      trigger.openPanel();
      this.toggleFlag = true;
    }
    else {
      trigger.closePanel();
      this.toggleFlag = false;
    }

  }
}
