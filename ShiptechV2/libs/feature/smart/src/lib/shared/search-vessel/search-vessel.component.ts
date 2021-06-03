import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalService } from '../../services/local-service.service';
import { Store, Select } from "@ngxs/store";
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { ISaveVesselData } from "./../../store/shared-model/vessel-data-model";
import { saveVesselDataAction } from "./../../store/bunker-plan/bunkering-plan.action";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-vessel',
  templateUrl: './search-vessel.component.html',
  styleUrls: ['./search-vessel.component.scss']
})
export class SearchVesselComponent implements OnInit, OnChanges {

  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<ISaveVesselData>;
  vesselRef: any;

  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;
  @Output() changeVessel = new EventEmitter();
  @Output() clearVessel = new EventEmitter();
  @ViewChild("filter") filterElement: ElementRef;
  //public vesselList = [];
  public displayClose: boolean;
  public enableVesselList: boolean = true;
  public filterList = [];
  public selectedValue = ""
  searchVesselControl = new FormControl();
  filteredOptions: Observable<string[]>;
  toggleFlag: boolean;
  public theme:boolean = true;
  constructor(private store: Store, private localService: LocalService, private route: ActivatedRoute) {
    this.vesselData$.subscribe(data=> {
      this.vesselRef = data?.vesselRef;
    });
  }
  
  ngOnInit() {
    this.localService.themeChange.subscribe(value => this.theme = value);
    //Get vessel list from route resolver to make default vessel on init
    this.route.data.subscribe(data => {
      console.log(data);
      this.vesselList = data?.vesselListWithImono;
    });

    this.vesselRef = (this.vesselRef)? this.vesselRef: this.vesselData;

    if(this.vesselRef?.imono) {
      this.searchVesselControl.setValue(this.vesselRef && this.vesselRef.imono ? this.vesselRef.imono : "");
      this.selectedValue = this.vesselRef && this.vesselRef.imono ? this.vesselRef.imono : "";
    } else {
    //get imono detail by using vessel id to update in vessel search
    let selectedVesselId = this.vesselRef?.vesselId;
    this.vesselRef = this.vesselList.find(element => (element.id == selectedVesselId));
    this.searchVesselControl.setValue(this.vesselRef && this.vesselRef.imono ? this.vesselRef.imono : "");
    this.selectedValue = this.vesselRef && this.vesselRef.imono ? this.vesselRef.imono : "";
    }
    this.filteredOptions = this.searchVesselControl.valueChanges.pipe(
      // startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnChanges() {
    this.setVesselList();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue == "")
      return;
    else
      return this.filterList.filter(option => (option.displayName.toLowerCase().indexOf(filterValue) > -1));
  }
  clearSearch() {
    this.searchVesselControl.setValue('');
    this.displayClose = false;
    this.enableVesselList = true;
    this.clearVessel.emit();
    if (document.getElementById('vesselSearch')) {
      document.getElementById('vesselSearch').focus();
    }
  }

  toggleVesselList($event, trigger: MatAutocompleteTrigger) {

    $event.stopPropagation();
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
  onClickInput(vessel) {

    this.searchVesselControl.setValue(vessel.value);
    if (this.searchVesselControl.value.trim() != "") {
      this.displayClose = true;
      this.enableVesselList = false;
      this.toggleFlag = false;
    }
  }
  onKeyDown(trigger: MatAutocompleteTrigger, event) {
    if (event.keyCode != '13') {//If not on keyboard ENTER keycode
      this.displayClose = true;
      this.enableVesselList = false;
      this.toggleFlag = false;
    }
  }

  setVesselList() {
    //Make a list of vesselname and vessel ID
    // this.vesselList.forEach(vessel => {
    //   // this.filterList.push({ VesselIMONO: vessel.VesselIMONO, VesselName: vessel.VesselIMONO });
    //   this.filterList.push({ VesselIMONO: vessel.imono, displayName: vessel.displayName })
    // })
    this.filterList = [...this.vesselList];
  }
  onVesselSelected(trigger: MatAutocompleteTrigger) {
    this.selectedValue = this.searchVesselControl.value;
    this.enableVesselList = true;
    this.toggleFlag = false;
    this.displayClose = false;
    if (document.getElementById('vesselSearch')) {
      document.getElementById('vesselSearch').blur();
    }
    let vessel = this.vesselList.filter(element => (element.imono == this.searchVesselControl.value) ||
      (element.imono.toLowerCase() == this.searchVesselControl.value.toLowerCase()));
    if (vessel.length > 0)
      this.store.dispatch(new saveVesselDataAction({'vesselRef': vessel[0]}));
      this.changeVessel.emit(vessel[0]);
  }

}
