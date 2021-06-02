import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OlMapComponent } from '../../shared/ol-map/ol-map.component';
import { VesselDetailsComponent } from '../vessel-details/vessel-details.component';
import { LocalService } from '../../services/local-service.service';
import { fromLonLat } from 'ol/proj';
import { WarningComponent } from '../../shared/warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-view-home',
  templateUrl: './map-view-home.component.html',
  styleUrls: ['./map-view-home.component.scss']
})
export class MapViewHomeComponent implements OnInit {

  @ViewChild(OlMapComponent) olmap;
  @ViewChild(VesselDetailsComponent) vesselDetail;
  public themeDark = true;//dark theme
  public portData;
  public showTable: boolean;
  public showHelp: boolean;
  public showNotifications: boolean;
  public showVesselDetails: boolean;
  public showBPlan: boolean;
  public showRoute: boolean;
  public showPortInfo: boolean;
  public showMenu: boolean;
  public showLogout: boolean;
  constructor(private localService: LocalService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.localService.setTheme(this.themeDark);
  }

  toggle() {
    this.showTable = !this.showTable;
  }
  toggleHelp(flag) {
    this.showHelp = flag;
    if (this.showHelp) {
      this.showNotifications = false;
      this.showMenu = false;
      this.showLogout = false;
    }
  }
  toggleMenu(flag) {
    this.showMenu = flag;
    if (this.showMenu) {
      // this.showNotifications = false;
      this.showHelp = false;
      this.showLogout = false;
    }
  }
  toggleNotif(flag) {
    this.showNotifications = flag;
    if (this.showNotifications) {
      this.showHelp = false;
      this.showMenu = false;
      this.showLogout = false;
    }
  }
  toggleLogout(flag) {
    this.showLogout = flag;
    if (this.showLogout) {
      this.showHelp = false;
      this.showMenu = false;
    }
  }
  onMapClick1() {
    // this.showNotifications = false;
    this.showHelp = false;
    this.showMenu = false;
    this.showLogout = false;
  }
  onMapClick2() {
    this.showNotifications = false;
  }
  onClick() {
    this.showVesselDetails = true;
    this.showTable = false;
  }
  toggleBPlan(event) {
    this.showBPlan = event;
    this.showRoute = false;
  }
  togglePortInfo(event) {
    this.showPortInfo = event.flag;
    this.portData = event.port;
  }
  toggleRoutes(event) {
    this.showRoute = event;
    this.showBPlan = false;
  }
  logout(){
    this.router.navigate(['login']);
    sessionStorage.removeItem('userlogin');
    
  }
  changeVessel(event) {
    // let view = event.ROB.Color.indexOf('red') > 0 ? 'higher-warning-view' :
    //   event.ROB.Color.indexOf('orange') > 0 ? 'minor-warning-view' : 'standard-view';
    let view = 'standard-view';
    this.olmap.vesselPopData = {
      name: event.displayName,
      vesselView: view,
      id: event.vesselId,
      destination: 'Marseille',
      eta1: '2020-04-13 10:00',
      eta2: '2020-04-14 10:00',
      next_destination: 'Catania',
      voyageStatus: 'Laden',
      vesselId: event.vesselId,
      vesselExpDate: '12/06/2020',
      vesselType: 'LR1',
      bunkeringStatus: 'Created',
      serviceId: '271',
      deptId: 'MLAS',
      ownership: 'Chartered',
      hsfo: '468',
      dogo: '600',
      ulsfo: '120',
      vlsfo: '364',
      hfo: '58',
      lshfo: '120',
      mdo: '10',
      lsmdo: '20',
      mgo: '10',
      lsmgo: '10',
      notificationsCount: 6,
      messagesCount: 2
    }
    this.olmap.vessel_view = view;
    var locations = {
      "start_location_name": event.StartLocation.LocationName,
      "start_location_id": event.StartLocation.LocationId,
      "end_location_name": event.EndLocation.LocationName,
      "end_location_id": event.EndLocation.LocationId
    }

    var lonlat = fromLonLat([event.vesselLongitude, event.vesselLatitude]);
    this.olmap.flyTo(lonlat, () => { this.olmap.isLoading = false }, 3);
    this.localService.setVesselPopupData(this.olmap.vesselPopData);
  }

  clickRoute() {
    let flag = this.localService.getBunkerPlanState();
    if (!flag) {
      if (this.olmap.vesselPopData.name.toLowerCase() == 'britta maersk') {
        this.olmap.showRoutes(true);
        this.toggleRoutes(true);
        this.olmap.isBunkerPlanOpen = false;
      }
    }
    else {
      const dialogRef = this.dialog.open(WarningComponent, {
        panelClass: ['confirmation-popup']

      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if (result == false) {
          if (this.olmap.vesselPopData.name.toLowerCase() == 'britta maersk') {
            this.olmap.showRoutes(true);
            this.toggleRoutes(true);
            this.olmap.isBunkerPlanOpen = false;
          }
          this.localService.setBunkerPlanState(false);
        }
        else {
        }

      })
    }

  }

  changeTheme() {
    this.themeDark = !this.themeDark;
    this.localService.setTheme(this.themeDark);
  }
}
