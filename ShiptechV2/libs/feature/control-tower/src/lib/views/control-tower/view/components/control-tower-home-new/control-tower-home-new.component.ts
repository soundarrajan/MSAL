import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { KnownControlTowerRoutes } from 'libs/feature/control-tower/src/lib/control-tower.routes';
import _ from 'lodash';

@Component({
  selector: 'app-control-tower-home-new',
  templateUrl: './control-tower-home-new.component.html',
  styleUrls: ['./control-tower-home-new.component.css']
})
export class ControlTowerHomeNewComponent implements OnInit, AfterViewInit {
  @ViewChild('controlViewElem') controlViewRef!: MatSelectChange;
  public showQuality: boolean = false;
  public showQuantity: boolean = false;
  public showResidue: boolean = false;
  public theme;
  public newScreen = true;
  selected: string;

  selectedVal: string = 'labs';
  selectedVal2: string = 'differences';
  selectedVal3: string = 'differences';
  controlTowerNotesViewType: any[];
  screenList: any[];
  screenType: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private legacyLookupsDatabase: LegacyLookupsDatabase
  ) {
    this.legacyLookupsDatabase
      .getTableByName('controlTowerNotesViewType')
      .then(response => {
        this.controlTowerNotesViewType = response;
        console.log(response);
      });
    this.legacyLookupsDatabase.getTableByName('screen').then(response => {
      this.screenList = response;
      console.log(response);
    });
    //load default landing page screen based on user preference
    this.loadDefaultLandingPage();
  }

  ngOnInit(): void {
    /* this.localService.themeChange.subscribe(data => {
      this.theme  = data;
    }) */
  }

  ngAfterViewInit() {
    this.viewChange(this.controlViewRef);
  }

  public onValChange(val: string) {
    this.selectedVal = val;
    this.selectedVal2 = val;
    this.selectedVal3 = val;
  }

  loadDefaultLandingPage() {
    let selectedId = this.route.snapshot.paramMap.get('id');
    // load default landing screen based on quality, quantity, residue view
    if (selectedId) {
      switch (Number(selectedId)) {
        case 5:
          this.selected = 'quality';
          break;
        case 6:
          this.selected = 'quantity';
          break;
        case 7:
          this.selected = 'residue';
          break;
        default:
          this.selected = 'quantity';
          break;
      }
    } else {
      // load default landing screen quantity view, if there is no default view based on user
      this.selected = 'quality';
    }
  }

  viewChange($event) {
    if ($event.value == 'quality') {
      this.showQuality = true;
      this.showQuantity = false;
      this.showResidue = false;
      this.screenType = 'QualityView';
      this.router
        .navigate([
          KnownPrimaryRoutes.ControlTower,
          `${KnownControlTowerRoutes.ControlTowerList}`,
          5
        ])
        .then(() => {});
    } else if ($event.value == 'quantity') {
      this.showQuality = false;
      this.showQuantity = true;
      this.showResidue = false;
      this.screenType = 'QuantityView';
      this.router
        .navigate([
          KnownPrimaryRoutes.ControlTower,
          `${KnownControlTowerRoutes.ControlTowerList}`,
          6
        ])
        .then(() => {});
    } else if ($event.value == 'residue') {
      this.showQuality = false;
      this.showQuantity = false;
      this.showResidue = true;
      this.screenType = 'ResidueView';
      this.router
        .navigate([
          KnownPrimaryRoutes.ControlTower,
          `${KnownControlTowerRoutes.ControlTowerList}`,
          7
        ])
        .then(() => {});
    } else {
      this.showQuality = true;
      this.showQuantity = false;
      this.showResidue = false;
    }
  }
}
