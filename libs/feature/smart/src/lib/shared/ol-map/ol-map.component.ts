import {
  Component,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  QueryList,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import OlFeature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import OlPoint from 'ol/geom/Point';
import OlVectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import OlVectorSource from 'ol/source/Vector';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import OlView from 'ol/View';
import { LocalService } from '../../services/local-service.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { WarningComponent } from '../warning/warning.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  transition,
  trigger,
  style,
  animate,
  state,
  query,
  stagger
} from '@angular/animations';
import { LoggerService } from '../../services/logger.service';
import LineString from 'ol/geom/LineString';
// import applyStyle from 'ol-mapbox-style';
import TileJSON from 'ol/source/TileJSON';
import TileLayer from 'ol/layer/Tile';
// import olms from 'ol-mapbox-style';
import FullScreen from 'ol/control/FullScreen';
import { MapViewService } from '../../services/map-view.service';
import { VesselPopupService } from '../../services/vessel-popup.service';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('vesselPopupAnimation', [
      transition(':leave', []),
      transition('*=>*', [style({ opacity: 0 }), animate('900ms')])
    ]),
    trigger('portPopupAnimation', [
      transition('1=>2', [
        style({ transform: 'translateX(-100%)', opacity: 1 }),
        animate(
          '500ms ease-in',
          style({ transform: 'translateX(0%)', opacity: 1 })
        )
      ]),
      transition('1=>0', [
        style({ transform: 'translateX(100%)', opacity: 1 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateX(0%)', opacity: 1 })
        )
      ]),

      transition('0=>1', [
        style({ transform: 'translateX(-100%)', opacity: 1 }),
        animate(
          '500ms ease-in',
          style({ transform: 'translateX(0%)', opacity: 1 })
        )
      ])
    ])
  ]
})
export class OlMapComponent implements OnInit, AfterViewInit {
  @ViewChildren(CdkDrag) cdkDrag: QueryList<CdkDrag>;

  @Input('displayHelp') displayHelp: boolean;
  @Input('hidePanel') hidePanel: boolean;
  @Input('displayNotifications') displayNotifications: boolean;
  @Output() toggleTableViewEmit = new EventEmitter();
  @Output() showBunkerPlan = new EventEmitter();
  @Output() openRoutes = new EventEmitter();
  @Output() showPortInfoScreen = new EventEmitter();
  @Output() onMapClick = new EventEmitter();
  isAnimate = false;
  animationState = false;
  animationWithState = false;
  map: any;
  mapCenterValues = [10, 10];
  minZoomLevel = 3;
  maxZoomLevel = 12;
  lightclick = false;
  public selectedFillterTag = 'All My Vessels';
  @ViewChild('olmap') olmapElement: any;
  @ViewChild('vessel_hover') vesselHoverElement: ElementRef;
  @ViewChild('port_hover') portHoverElement: ElementRef;
  @ViewChild('hover_circle') hoverCircleElement: ElementRef;

  lastUpdatedOn: string = 'Today 10:45:08';
  public routeData;
  public vesselPopData;
  public portPopData;
  public showPortList = [];
  public showPortCount = 0;
  public showVesselPop: boolean;
  public showLocationPop: boolean;
  public showFullLocationInfo: boolean;
  public showFullVesselInfo: boolean;
  public showFullVesselInfo1: boolean;
  public showFullLocationInfo1: boolean;
  public displayRoute: boolean;
  public highIntensity: boolean = true;
  public theme: boolean = true;
  public hoverVesselName;
  public hoverVesselColor;
  public hoverPortName;
  public hoverPortColor;
  public isLoading: boolean = true;
  public vessel_view;
  public hoverPopupColor;
  public maxZoomLimit: boolean;
  public minZoomLimit: boolean;
  public isBunkerPlanEdited: boolean;
  public isBunkerPlanOpen: boolean;
  public isPortInfoOpen: boolean;
  public dialogRef: MatDialogRef<WarningComponent>;
  public popupCount = 0;
  public routeFound: boolean = false;
  public vesselPopupIsVisible: boolean = false;
  public nextPortIndex = -1;
  public strokeColor;
  public clickedPort;
  public vesselList = [];
  public vesselListWithImo = [];
  public portList = [];
  public isRegionFilterSelected: boolean = false;
  public regionFilterType: string = '';
  public filterData = [
    {
      name: 'All My Vessels',
      count: '0',
      color: '#5780A6',
      lonlat: []
    },
    {
      name: 'Unmanageable Vessels',
      count: '0',
      color: '#5780A6',
      lonlat: []
    },
    {
      name: 'European Region',
      count: '0',
      color: '#5780A6',
      // lonlat: [1698859.9306153469, 6262837.730208559],
      lonlat: []
    },
    {
      name: 'N.America Region',
      count: '0',
      color: '#5780A6',
      // lonlat: [-11529522.794165753, 5795972.288921478],
      lonlat: []
    },
    {
      name: 'Asia Region',
      count: '0',
      color: '#5780A6',
      // lonlat: [10143642.22417868, 7066005.284367598],
      lonlat: []
    }
  ];
  private selectedVessel;

  //Layers
  // Global Map
  private mapLayer = new OlVectorLayer({
    source: new OlVectorSource({
      // url: './assets/data/geo.json',//'https://raw.githubusercontent.com/openlayers/ol3/6838fdd4c94fe80f1a3c98ca92f84cf1454e232a/examples/data/geojson/countries.geojson',
      // url: 'https://raw.githubusercontent.com/openlayers/openlayers/master/examples/data/geojson/countries.geojson',
      // url: 'https://raw.githubusercontent.com/openlayers/ol3/6838fdd4c94fe80f1a3c98ca92f84cf1454e232a/examples/data/geojson/countries.geojson',
      //url: 'https://api.maptiler.com/maps/topo/style.json?key=PAYU1Mctev9jZaYj5AGF',
      // url: './assets/data/countries.json',
      url: './assets/data/countries.json',
      format: new GeoJSON(),
      id: 'map_layer'
    } as any),
    style: function(feature) {
      const newStyle = countryText_Dark;
      countryText_Dark.getText().setText(feature.get('name'));
      return newStyle;
    }
  });
  private mapLayer1 = new OlVectorLayer({
    source: new OlVectorSource({
      // url: './assets/data/geo.json',//'https://raw.githubusercontent.com/openlayers/ol3/6838fdd4c94fe80f1a3c98ca92f84cf1454e232a/examples/data/geojson/countries.geojson',
      // url: 'https://raw.githubusercontent.com/openlayers/openlayers/master/examples/data/geojson/countries.geojson',
      // url: 'https://raw.githubusercontent.com/openlayers/ol3/6838fdd4c94fe80f1a3c98ca92f84cf1454e232a/examples/data/geojson/countries.geojson',
      //url: 'https://api.maptiler.com/maps/topo/style.json?key=PAYU1Mctev9jZaYj5AGF',
      // url: './assets/data/countries.json',
      url: './assets/data/countries.json',
      format: new GeoJSON(),
      id: 'map_layer'
    } as any),
    style: function(feature) {
      const newStyle = countryText;
      countryText.getText().setText(feature.get('name'));
      return newStyle;
    }
  });

  private mapLayer_click_dark_layer = new OlVectorLayer({
    source: new OlVectorSource({
      url: './assets/data/countries.json',
      format: new GeoJSON(),
      id: 'map_layer'
    } as any),
    style: function(feature) {
      const newStyle2 = countryText_dark_click;
      countryText.getText().setText(feature.get('name'));
      return newStyle2;
    }
  });

  // private mapLayer =
  // new TileLayer({
  //   source: new TileJSON({
  //     url: 'https://api.maptiler.com/maps/topo/tiles.json?key=PAYU1Mctev9jZaYj5AGF',
  //       crossOrigin: 'anonymous',
  //   }),

  // })

  // Features is Markers
  private vesselMakersLayer = new OlVectorLayer({
    source: new OlVectorSource({
      features: []
    })
  });

  //Port Layer
  private portMakersLayer = new OlVectorLayer({
    source: new OlVectorSource({
      features: []
    })
  });

  //Router Layer
  private routeLayer = new OlVectorLayer({
    source: new OlVectorSource({
      features: []
    })
    // style:
  });

  private vesselAnimateLayer = new OlVectorLayer({
    source: new OlVectorSource({
      wrapX: false
    })
  });

  //OverLays
  private vesselHoverPopupOverlay;
  private portHoverPopupOverlay;
  private hoverCircleEffectOverlay;

  constructor(
    private store: Store,
    private localService: LocalService,
    private routeActive: ActivatedRoute,
    private vesselService: VesselPopupService,
    public dialog: MatDialog,
    private logger: LoggerService,
    private mapService: MapViewService
  ) {
    this.logger.logInfo('OlMapComponent-ngOnInit()', new Date());
  }

  ngOnInit() {
    this.localService.isBunkerPlanEdited.subscribe(value => {
      this.isBunkerPlanEdited = value;
    });
    this.routeActive.data.subscribe(data => {
      console.log(data);
      this.vesselListWithImo = data?.vesselListWithImono;
    });
    // this.localService.themeChange.subscribe(value => {
    //   this.theme = value;
    //   if(!this.theme){
    //     console.log("HELLO")
    //     // var styleJson = 'https://api.maptiler.com/maps/675b0894-9653-46dc-a025-c2530aaa9eaf/style.json?key=PAYU1Mctev9jZaYj5AGF';
    //     // olms(this.map, styleJson);
    //   }
    //   else{
    //     console.log("HELLO2");
    //   }

    // }
    //   );
    this.localService.portPopUpDetails.subscribe(data => {
      this.showPortList = data;
      if (this.displayRoute && this.showPortList[0]) {
        //If Route is open and a port is opened from scheduled list in Vessel popup

        // var lonlat = fromLonLat([this.showPortList[0].longitude, this.showPortList[0].latitude]);
        //  this.createPopup(this.showPortList[0],lonlat)
        const feature1 = this.routeLayer
          .getSource()
          .getFeatures()
          .filter((ele: any) => ele.values_.id == 'RL');

        feature1.forEach(element => {
          const sty = element.getStyle() as any;
          sty.stroke_.color_ = '#BBBDBF';
          element.setStyle(sty);
        });

        const feature2 = this.routeLayer
          .getSource()
          .getFeatures()
          .filter((ele: any) => ele.values_.type == 'port-on-route'); //Port Icon on Route

        feature2.forEach(element => {
          if (
            this.showPortList[0].name ==
            element.getProperties().data.locationName
          )
            element.setStyle(
              this.getPortGlowStyle(element.getProperties().data.flag)
            );
          else element.setStyle(this.getPortGlowStyle(-1));
        });

        const feature3 = this.routeLayer
          .getSource()
          .getFeatures()
          .filter((ele: any) => ele.values_.type == 'vessel-glow'); //Vessel Icon Glow on Route

        feature3.forEach(element => {
          element.setStyle(this.getVesselGlowStyle('grey'));
        });

        const feature4 = this.routeLayer
          .getSource()
          .getFeatures()
          .filter((ele: any) => ele.values_.type == 'vessel-on-route'); //Vessel Icon on Route
        feature4.forEach(element => {
          element.setStyle(
            this.getGreyVesselStyle(element.getProperties().data)
          );
        });

        const feature5 = this.routeLayer
          .getSource()
          .getFeatures()
          .filter((ele: any) => ele.values_.type == 'next-port'); //Next Port Icon on Route

        feature5.forEach((element: any) => {
          if (
            this.showPortList[0].name ==
            element.getProperties().data.locationName
          )
            element.setStyle(this.getNextPortStyle('blue'));
          else element.setStyle(this.getNextPortStyle('grey'));
        });
      }
    });
    this.localService.openedPortPopupCount.subscribe(count => {
      if (this.showVesselPop) {
        this.popupCount = count + 1;
      } else {
        this.popupCount = count;
      }
    });
  }
  ngOnChanges() {
    this.highIntensity = !this.displayHelp && !this.displayNotifications;
  }
  // public poup_overlay:any;
  ngAfterViewInit() {
    this.loadMap();
    this.getDefaultView();
    this.loadEventListeners();
    this.mapService.getVesselsListForMap(' ').subscribe((res: any) => {
      if (res.payload != undefined) {
        this.vesselList = res.payload;
        this.loadVessels(' ');
        const titleEle = document.getElementsByClassName(
          'page-title'
        )[0] as HTMLElement;
        titleEle.click();
      }
    });
    this.setCenter();
    //this.portMakersLayer.setVisible(true);
    this.mapService.getLocationsListForMap(' ').subscribe(res => {
      if (res.payload != undefined) {
        this.portList = res.payload;
        this.loadPorts(' ');
        this.portMakersLayer.setVisible(false);
      }
    });
    this.loadFilterData();

    // this.loadRoute();

    this.vesselHoverPopupOverlay = new Overlay({
      element: this.vesselHoverElement.nativeElement,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.portHoverPopupOverlay = new Overlay({
      element: this.portHoverElement.nativeElement,
      positioning: 'top-left',
      stopEvent: false,
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      },
      zindex: 1
    } as any);
    this.hoverCircleEffectOverlay = new Overlay({
      element: this.hoverCircleElement.nativeElement,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(this.hoverCircleEffectOverlay);
    this.map.addOverlay(this.vesselHoverPopupOverlay);
    this.map.addOverlay(this.portHoverPopupOverlay);
    this.logger.logInfo('OlMapComponent-ngAfterViewInit()', new Date());
  }

  loadMap() {
    const mapView = new OlView({
      center: fromLonLat(this.mapCenterValues),
      zoom: this.minZoomLevel,
      minZoom: this.minZoomLevel,
      maxZoom: this.maxZoomLevel
    });
    //mapLayer---Dark Map
    //mapLayer1---Light Map
    this.map = new OlMap({
      layers: [
        this.mapLayer1,
        this.mapLayer,
        this.mapLayer_click_dark_layer,
        this.portMakersLayer,
        this.vesselMakersLayer,
        this.routeLayer,
        this.vesselAnimateLayer
      ],
      OverLays: [],
      controls: [],
      target: this.olmapElement.nativeElement,
      view: mapView
      // interactions: olinteraction
    } as any);
    this.localService.themeChange.subscribe(value => {
      this.theme = value;
      // if(!this.theme && !this.lightclick){
      //   this.mapLayer_click_dark_layer.setOpacity(1);
      // }
      if (!this.theme) {
        this.mapLayer.setOpacity(0); //dark

        if (this.showVesselPop || this.showPortList.length > 0)
          this.setMapOpacity(0.5);
        // this.map.removeLayer(this.mapLayer);
        // this.vesselMakersLayer.setZIndex(1);
        // this.portMakersLayer.setZIndex(1);
        // this.routeLayer.setZIndex(1);
        // this.vesselAnimateLayer.setZIndex(1);
        // this.mapLayer1.setZIndex(1);
        // this.map.addLayer(this.mapLayer1);
        if (this.showVesselPop || this.showLocationPop) {
          // this.setMapOpacity(1);
          // this.vesselMakersLayer.setOpacity(1);
          // this.portMakersLayer.setOpacity(1);
          // this.highIntensity = true;
          this.lightclick = true;
          this.mapLayer_click_dark_layer.setOpacity(1);
        } else {
          this.mapLayer1.setOpacity(1);
        }
      } else {
        this.mapLayer1.setOpacity(0);
        if (this.showVesselPop || this.showPortList.length > 0)
          this.setMapOpacity(0.3);
        // this.map.removeLayer(this.mapLayer1);
        // this.mapLayer.setZIndex(-1);
        // this.map.addLayer(this.mapLayer);
        if (this.showVesselPop || this.showLocationPop) {
          this.lightclick = false;
          this.mapLayer_click_dark_layer.setOpacity(0);
        } else {
          this.mapLayer.setOpacity(1);
        }
      }
    });
    this.mapLayer_click_dark_layer.setOpacity(0);
  }

  public setMapOpacity(value) {
    if (this.theme) {
      this.mapLayer.setOpacity(value);
    } else {
      this.mapLayer1.setOpacity(value);
    }
  }

  createVesselMakeSrs(vessels: any, showVesselGlow: boolean = false) {
    const vesselMakesrs = [];
    this.getCurrentTime();
    for (const vesselDetail of vessels) {
      const marker = new OlFeature({
        id: 'ST' + vesselDetail.vesselId,
        type: 'vessel',
        data: vesselDetail,
        geometry: new OlPoint(
          fromLonLat([
            vesselDetail.vesselLongitude,
            vesselDetail.vesselLatitude
          ])
        )
      });
      marker.setStyle(this.getVesselStyle(vesselDetail));
      vesselMakesrs.push(marker);

      //Vessel Glow
      if (showVesselGlow) {
        const vesselGlow = new OlFeature({
          id: 'STG' + vesselDetail.vesselId,
          type: 'vessel-glow',
          data: vesselDetail,
          geometry: new OlPoint(
            fromLonLat([
              vesselDetail.vesselLongitude,
              vesselDetail.vesselLatitude
            ])
          )
        });
        vesselGlow.setStyle(this.getVesselGlowStyle('blue'));
        vesselMakesrs.push(vesselGlow);
      }
    }
    if (vesselMakesrs.length > 0) {
      this.vesselMakersLayer.getSource().addFeatures(vesselMakesrs);
      this.setCenter();
    }
  }

  createPortMakeSrs(ports: any) {
    const portMakesrs = [];
    this.getCurrentTime();
    for (const port of ports) {
      const marker = new OlFeature({
        id: 'PID' + port.locationId,
        type: 'port',
        data: port,
        geometry: new OlPoint(
          fromLonLat([port.locationLongitude, port.locationLatitude])
        )
      });
      marker.setStyle(
        this.getPortStyle(
          port.locationName.toUpperCase(),
          port.isMajorLocation,
          port.flag
        )
      );
      portMakesrs.push(marker);
    }
    if (portMakesrs.length > 0)
      this.portMakersLayer.getSource().addFeatures(portMakesrs);
  }

  loadPorts(filter) {
    this.portMakersLayer.getSource().clear();
    if (filter == ' ' || filter == 'Unmanageable Vessels') {
      this.createPortMakeSrs(this.portList);
    } else {
      this.createPortMakeSrs(
        this.portList.filter(item => item.regionName == filter)
      );
    }
  }

  loadFilterData() {
    this.mapService.getRegionFiltersForMap(' ').subscribe(res => {
      if (res.payload != undefined) {
        const portMakesrs = [];
        this.getCurrentTime();
        res.payload.forEach(filter => {
          switch (filter.regionName) {
            case 'My Vessels': {
              this.filterData[0].count = filter.vesselsCount;
              break;
            }
            case 'Unmanagable Vessels': {
              this.filterData[1].count = filter.vesselsCount;
              break;
            }
            case 'Europe': {
              this.filterData[2].count = filter.vesselsCount;
              break;
            }
            case 'North America': {
              this.filterData[3].count = filter.vesselsCount;
              break;
            }
            case 'Asia': {
              this.filterData[4].count = filter.vesselsCount;
              break;
            }
          }
        });
        this.triggerClickEvent();
      }
    });
  }
  triggerClickEvent() {
    const titleEle = document.getElementsByClassName(
      'page-title'
    )[0] as HTMLElement;
    titleEle.click();
  }

  public getPortMarkerStyle(port): Style {
    const iconStyle = new Style({
      text: new Text({
        offsetY: 10,
        offsetX: 10,
        scale: 1,
        text: port.toUpperCase(),
        fill: new Fill({
          color: '#d4d4d4'
        })
      })
    });
    return iconStyle;
  }
  public getClickedPortStyle(flag): Style {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.8, 0.35],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src:
          './assets/customicons/port/destination' +
          (flag == 'higher-warning-view'
            ? '-red'
            : flag == 'minor-warning-view'
            ? '-amber'
            : '-blue') +
          '.svg',
        opacity: 1,
        anchorOrigin: 'bottom-left',
        scale: 1.45
      })
    });
    return iconStyle;
  }

  resetHoverItems(items) {
    //reset hover effect
    for (const val of items) {
      if (val.get('type') == 'vessel')
        val.setStyle(this.getVesselStyle(val.get('data')));
      if (val.get('type') == 'port') {
        const port = val.get('data');
        val.setStyle(
          this.getPortStyle(
            port.locationName.toUpperCase(),
            port.isMajorLocation,
            port.flag
          )
        );
      }
    }
    const e = document.getElementsByClassName('ol-hover-popup');
    for (let i = 0; i < e.length; i++) {
      e[i].remove();
    }
  }

  filterChipClick(item) {
    this.routeLayer.setVisible(false);
    this.setMapOpacity(1);
    this.vesselMakersLayer.setOpacity(1);
    this.showVesselPop = false;
    this.showLocationPop = false;
    this.selectedFillterTag = null;
    if (item != null) {
      switch (item.name) {
        case 'All My Vessels': {
          this.selectedFillterTag = null;
          this.loadVessels(' ');
          this.portMakersLayer.setVisible(false);
          //this.loadPorts(" ")
          this.isRegionFilterSelected = false;
          this.setCenter();
          break;
        }
        case 'Unmanageable Vessels': {
          this.selectedFillterTag = item.name;
          this.loadVessels('Unmanageable Vessels');
          this.portMakersLayer.setVisible(false);
          //this.loadPorts('Unmanageable Vessels')
          this.isRegionFilterSelected = false;
          this.setCenter();
          break;
        }
        case 'European Region': {
          this.selectedFillterTag = item.name;
          //this.flyTo(item.lonlat, () => { this.isLoading = false }, 4.2);
          this.loadVessels('Europe');
          //this.loadPorts('Europe')
          this.regionFilterType = 'Europe';
          this.isRegionFilterSelected = true;
          this.setCenter();
          break;
        }
        case 'N.America Region': {
          this.selectedFillterTag = item.name;
          //this.flyTo(item.lonlat, () => { this.isLoading = false }, 3.5);
          this.loadVessels('North America');
          //this.loadPorts('North America')
          this.regionFilterType = 'North America';
          this.isRegionFilterSelected = true;
          this.setCenter();
          break;
        }
        case 'Asia Region': {
          this.selectedFillterTag = item.name;
          //this.flyTo(item.lonlat, () => { this.isLoading = false }, 3.5);
          this.loadVessels('Asia');
          //this.loadPorts('Asia');
          this.regionFilterType = 'Asia';
          this.isRegionFilterSelected = true;
          this.setCenter();
          break;
        }
      }
    } else this.selectedFillterTag = null;
  }

  //Events - start

  setdata(vData) {
    this.vessel_view = 'standard-view'; //vData.ROB.Color.indexOf('red') > 0 ? 'higher-warning-view' :
    //vData.ROB.Color.indexOf('orange') > 0 ? 'minor-warning-view' : 'standard-view';
    this.routeData = '';
    this.vesselPopData = {
      vesselView: this.vessel_view,
      name: vData.vesselName,
      id: vData.vesselId,
      vesselCode: vData.vesselCode,
      destination: '',
      eta1: '',
      eta2: '',
      next_destination: '',
      voyageDetailId: '',
      voyageStatus: 'Laden',
      vesselId: vData.vesselId,
      vesselExpDate: '',
      redeliveryDays: '',
      vesselType: 'LR1',
      bunkeringStatus: 'Created',
      serviceId: '',
      serviceCode: '',
      deptId: '',
      ownership: '',
      hsfo: '',
      lsdis: '',
      dis: '',
      ulsfo: '',
      vlsfo: '',
      hfo: '',
      lshfo: '',
      mdo: '',
      lsmdo: '',
      mgo: '',
      lsmgo: '',
      notificationsCount: 6,
      messagesCount: 2,
      routeAvailable: 0
    };
    if (this.cdkDrag.length > 0)
      //Reset the pop up position after drag
      this.cdkDrag.forEach(popup => popup._dragRef.reset());
    this.popupCount = this.showPortList.length + 1;
    this.localService.setVesselPopupData(this.vesselPopData);
    // this.selectedVessel = vData;
    // this.vesselPopData.name = vData.VesselName;
    // this.vesselPopData.vesselType = vData.VesselType;
    // this.vesselPopData.hsfo = vData.ROB.HSFO.Value;
    // this.vesselPopData.dogo = vData.ROB.DOGO.Value;
    // this.vesselPopData.ulsfo = vData.ROB.ULSFO.Value;
    // //this.vesselPopData.vlsfo = vData.ROB.VLSFO.Value;
    // this.vesselPopData.voyageStatus = vData.VoyageStatus;
    // this.vesselPopData.bunkeringStatus = vData.Request.RequestStatus;
    // this.vesselPopData.eta = vData.StartLocation.ETA;
    // this.vesselPopData.destination = vData.EndLocation.LocationName;
    // this.vesselPopData.eta = vData.EndLocation.ETA;

    // var locations = {
    //   "start_location_name": vData.StartLocation.LocationName,
    //   "start_location_id": vData.StartLocation.LocationId,
    //   "end_location_name": vData.EndLocation.LocationName,
    //   "end_location_id": vData.EndLocation.LocationId
    // }

    const lonlat = fromLonLat([vData.vesselLongitude, vData.vesselLatitude]);
    this.flyTo(
      lonlat,
      () => {
        this.isLoading = false;
      },
      3
    );

    //this.drawRoute(vData, locations);
    //this.showLocationPop = false;
    //this.routeLayer.getSource().clear(); //to clear the route
    this.showVesselPop = true;
  }

  setPortData(pData) {
    if (
      !(
        this.showPortList.filter(port => port.name == pData.locationName)
          .length > 0
      )
    ) {
      const count = this.showPortList.length;
      this.portPopData = {
        locationId: pData.locationId,
        position: 1,
        port_view: 'standard-view', //pData.flag,
        name: pData.locationName,
        earliestTradingTime: '',
        latestTradingTime: '',
        avlProdCategory: [],
        //notavlProdCategory: ['DIS'],
        // destination: 'Marseille',
        // eta1: '2020-04-13 10:00',
        // eta2: '2020-04-14 10:00',
        // next_destination: 'Catania',
        // voyageStatus: 'Laden',
        // vesselId: '1YM',
        // vesselExpDate: '12/06/2020',
        // vesselType: 'LR1',
        // bunkeringStatus: 'Created',
        // serviceId: '271',
        // deptId: 'MLAS',
        // ownership: 'Chartered',
        // hsfo: '468',
        // dogo: '600',
        // ulsfo: '120',
        // vlsfo: '364',
        // hfo: '58',
        // lshfo: '120',
        // mdo: '10',
        // lsmdo: '20',
        // mso: '10',
        // lsmgo: '10',
        notificationsCount: 6,
        messagesCount: 2,
        latitude: pData.locationLatitude,
        longitude: pData.locationLongitude
      };
      if (count >= this.showPortCount) {
        this.showPortList.splice(0, 1);
      }
      if (this.cdkDrag.length > 0)
        //Reset the pop up position after drag
        this.cdkDrag.forEach(popup => popup._dragRef.reset());
      this.showPortList.push(this.portPopData);
      //Set pop up position
      if (this.showVesselPop) {
        if (this.showPortList.length == 1) {
          this.showPortList[0].position = 0;
        } else if (this.showPortList.length == 2) {
          this.showPortList[0].position = 0;
          this.showPortList[1].position = 0;
        }
      } else {
        if (this.showPortList.length == 1) {
          this.showPortList[0].position = 0;
        } else if (this.showPortList.length == 2) {
          this.showPortList[0].position = 0;
          this.showPortList[1].position = 0;
        } else if (this.showPortList.length == 3) {
          this.showPortList[0].position = 0;
          this.showPortList[1].position = 0;
          this.showPortList[2].position = 0;
        }
      }
      if (this.showVesselPop) {
        this.popupCount = this.showPortList.length + 1;
      } else {
        this.popupCount = this.showPortList.length;
      }
    }
    this.localService.setPortPopupData(this.showPortList);
  }

  drawRoute(data, locations) {
    this.routeLayer.getSource().clear();
    // this.map.
    // if (data.VesselIMONO == '9301914')
    // this.localService.getSeaRoute(data.VesselIMONO).subscribe((res: any) => {
    // this.strokeColor = (this.vessel_view == 'minor-warning-view' ? '#E8AC55' : (this.vessel_view == 'higher-warning-view' ? '#FF7362' : '#66B0D6'));
    let dottedLine = false;
    let startLoc;
    let endLoc;
    const temp = [];
    const vesselInfo = this.vesselList.find(
      vessel => vessel.vesselName == data[0].vesselName
    );

    for (let i = 0; i < data.length; i++) {
      if (data[i].routeJson !== undefined && data[i].routeJson != '')
        if (data[i].startLocation === data[i].vesselName) {
          dottedLine = true;
        }
      var routes = data[i].routeJson == '' ? '' : JSON.parse(data[i].routeJson);
      if (routes) {
        for (const routeJson of routes.getRouteJson) {
          var routes = routeJson.routepoints;
          let lineStringStyleNw;
          var longPlus = [];
          var longMinus = [];
          routes.forEach(x => {
            temp.push(x);
            x['lng'] = x['lon'];
            if (x['lon'] > 0) {
              longPlus.push(x);
            } else {
              longMinus.push(x);
            }
          });

          if (longMinus.length > 0) {
            this.drawVesselRouteLines(
              longMinus,
              lineStringStyleNw,
              vesselInfo,
              data[i],
              i
            );
          }
          if (longPlus.length > 0) {
            this.drawVesselRouteLines(
              longPlus,
              lineStringStyleNw,
              vesselInfo,
              data[i],
              i
            );
          }
          //this.createPopup(res[i]);
        }
      }

      if (data[i].startLocation == locations.start_location_name) {
        startLoc = {
          geoLocation: new OlPoint(
            fromLonLat([
              data[i].startLocationLatitude,
              data[i].startLocationLongitude
            ])
          ),
          locationID: locations.start_location_id
        };
        this.addLocationPin(true, startLoc);
      }
      if (data[i].startLocation == locations.start_location_name) {
        endLoc = {
          geoLocation: new OlPoint(
            fromLonLat([
              data[i].startLocationLatitude,
              data[i].startLocationLongitude
            ])
          ),
          locationID: locations.start_location_id
        };
        this.addLocationPin(false, endLoc);
      }
    }
    //  var lonlat = fromLonLat([173.9820215,47.7896949]);
    const z = Math.round(temp.length / 2.5);

    const lonlat = fromLonLat([temp[z].lon, temp[z].lat]);
    this.flyTo(
      lonlat,
      () => {
        this.isLoading = false;
      },
      2.5
    );

    this.routeFound = false;
    // });
  }

  createPopup(data, coordinates) {
    let popupData;
    const e = document.getElementsByClassName('ol-popup');
    for (let i = 0; i < e.length; i++) {
      e[i].remove();
    }
    // if (data.LocationName == 'Loke' || data.LocationName == 'NEW YORK' || data.LocationName == 'CRISTOBAL') {
    this.clickedPort = data.locationName;
    const element = document.createElement('div');
    element.classList.add('ol-popup');
    if (data.locationName == 'CRISTOBAL') {
      //Bunker strategy port popup
      element.innerHTML = `<div class="popup-content">
      <div style="white-space:nowrap;display:flex;align-items:center;">
      <span style="padding-right:5px;">   <img src="./assets/customicons/port-icon.svg">
      </span>
      <span class="days"> 3 Days </span> <span style="padding:0px 5px;font-weight:500;">to</span> <span class="days">${data.locationName}</span> </div>
        <div style="line-height: 23px;padding:0px 2px;font-weight:500;"> ETA <span class="date"> 2019-01-19 </span><span class="time">10:00</span> </div>
        <div style="line-height: 23px;padding:0px 2px;font-weight:500;"> ETD <span class="date"> 2019-01-19 </span><span class="time">10:00</span> </div>
        <div class="strategic-port"><img style="padding:0px 5px;" src="./assets/customicons/strategic-port.svg" >Strategic Port</div>
          </div>`;
    } else {
      this.routeData.find(item => {
        if (
          item.startLocation == data.locationName &&
          item.vesselName == item.nextLocation
        ) {
          //data.locationName = item.vesselName;
          popupData = ''; //item;
        } else if (item.nextLocation == data.locationName) popupData = item;
      });
      if (popupData) {
        const daysLeft = popupData.daysLeft.split('to');
        const dateTimeArr = popupData.eta.split('T');
        const eta = dateTimeArr.slice(0, 1);
        let TimeArr = dateTimeArr[1].split('Z');
        TimeArr = TimeArr.slice(0, 1);
        TimeArr = TimeArr[0].split(':');
        const time = TimeArr[0] + ':' + TimeArr[1];

        element.innerHTML = `<div class="popup-content">
          <div style="white-space:nowrap;display:flex;align-items:center;">
          <span style="padding-right:5px;">   <img src="./assets/customicons/port-icon.svg">
          </span>
          <span class="days">${daysLeft[0]}</span> <span style="padding:0px 5px;">to</span> <span class="days">${data.locationName}</span> </div>
            <div style="line-height: 23px;padding:0px 2px;"> ETA <br>
            <span class="date">${eta}</span><span class="time"> ${time}</span> </div>
              </div>`;
      }
    }

    const overlay = new Overlay({
      element: element,
      positioning: 'center-left'
    });
    // overlay.setPosition(fromLonLat([data.Longitude, data.Latitude]));
    overlay.setPosition(coordinates);
    // overlay.setPosition(fromLonLat([data.NextLocationLongitude, data.NextLocationLatitude]));
    this.map.addOverlay(overlay);
    // }
  }
  createHoverPopup(data, coordinates) {
    let popupData;
    if (this.clickedPort != data.locationName) {
      // if (data.locationName == 'Loke' || data.locationName == 'NEW YORK' || data.locationName == 'CRISTOBAL') {
      const element = document.createElement('div');
      element.classList.add('ol-hover-popup');
      if (data.locationName == 'CRISTOBAL') {
        //Bunker strategy port popup
        element.innerHTML = `<div class="popup-content">
        <div style="white-space:nowrap;display:flex;align-items:center;">
        <span style="padding-right:5px;">   <img src="./assets/customicons/port-icon.svg">
        </span>
        <span class="days"> 3 Days </span> <span style="padding:0px 5px;">to</span> <span class="days">${data.locationName}</span> </div>
          <div style="line-height: 23px;padding:0px 2px;"> ETA <span class="date"> 2019-01-19 </span><span class="time">10:00</span> </div>
          <div style="line-height: 23px;padding:0px 2px;"> ETD <span class="date"> 2019-01-19 </span><span class="time">10:00</span> </div>
          <div class="strategic-port"><img style="padding:0px 5px;" src="./assets/customicons/strategic-port.svg" >Strategic Port</div>
            </div>`;
      } else {
        this.routeData.find(item => {
          if (
            item.startLocation == data.locationName &&
            item.vesselName == item.nextLocation
          ) {
            // data.locationName = item.vesselName;
            popupData = '';
          } else if (item.nextLocation == data.locationName) popupData = item;
        });
        if (popupData) {
          const daysLeft = popupData.daysLeft.split('to');
          const dateTimeArr = popupData.eta.split('T');
          const eta = dateTimeArr.slice(0, 1);
          let TimeArr = dateTimeArr[1].split('Z');
          TimeArr = TimeArr.slice(0, 1);
          TimeArr = TimeArr[0].split(':');
          const time = TimeArr[0] + ':' + TimeArr[1];

          element.innerHTML = `<div class="popup-content">
            <div style="white-space:nowrap;display:flex;align-items:center;">
            <span style="padding-right:5px;">   <img src="./assets/customicons/port-icon.svg">
            </span>
            <span class="days">${daysLeft[0]}</span> <span style="padding:0px 5px;">to</span> <span class="days">${data.locationName}</span> </div>
              <div style="line-height: 23px;padding:0px 2px;"> ETA <br>
              <span class="date">${eta}</span><span class="time"> ${time}</span> </div>
                </div>`;

          const overlay = new Overlay({
            element: element,
            positioning: 'center-left'
          });
          overlay.setPosition(coordinates);
          this.map.addOverlay(overlay);
        }
      }
      // }
    }
  }
  addLocationPin(isStart, data): any {
    if (isStart) {
      const marker = new OlFeature({
        id: 'ST' + data.locationID,
        type: 'startLoc',
        data: data,
        geometry: data.geoLocation
      });
      return marker;
    } else {
      return null;
    }
  }

  /**
   *
   * @param pathArr : array of coordinates for route
   * @param linestyle : style path like solid, dotted and small dotted lines
   */
  drawVesselRouteLines(pathArr, linestyle, vesselInfo, routes, ind) {
    this.strokeColor =
      this.vessel_view == 'minor-warning-view'
        ? '#E8AC55'
        : this.vessel_view == 'higher-warning-view'
        ? '#FF7362'
        : '#66B0D6';
    const featureRoutes = [];

    pathArr.forEach((item, index) => {
      if (this.routeFound) {
        linestyle = new Style({
          stroke: new Stroke({
            color: this.strokeColor,
            width: 2,
            lineDash: [3, 6]
          })
        });
      } else if (
        vesselInfo.vesselLongitude == item.lon &&
        vesselInfo.vesselLatitude == item.lat
      ) {
        linestyle = new Style({
          stroke: new Stroke({
            color: this.strokeColor,
            width: 2,
            lineDash: [0, 0]
          })
        });
        this.routeFound = true;
        this.nextPortIndex = ind;
      } else {
        linestyle = new Style({
          stroke: new Stroke({
            color: this.strokeColor,
            width: 2,
            lineDash: [0, 0]
          })
        });
      }
      if (index != pathArr.length - 1) {
        const lineString = new LineString([
          [item.lon, item.lat],
          [pathArr[index + 1].lon, pathArr[index + 1].lat]
        ]);
        lineString.transform('EPSG:4326', 'EPSG:3857');
        const featureLineString = new OlFeature({
          geometry: lineString,
          name: 'vesselLine',
          id: 'RL'
        });
        featureLineString.setStyle(linestyle);
        featureRoutes.push(featureLineString);
      }
    });

    //Vessel Glow
    const vesselGlow = new OlFeature({
      id: 'STG' + vesselInfo.vesselId,
      type: 'vessel-glow',
      data: vesselInfo,
      geometry: new OlPoint(
        fromLonLat([vesselInfo.vesselLongitude, vesselInfo.vesselLatitude])
      )
    });
    vesselGlow.setStyle(this.getVesselGlowStyle('blue'));
    featureRoutes.push(vesselGlow);

    const vesselmarker = new OlFeature({
      id: 'STD' + vesselInfo.vesselId,
      type: 'vessel-on-route',
      data: vesselInfo,
      geometry: new OlPoint(
        fromLonLat([vesselInfo.vesselLongitude, vesselInfo.vesselLatitude])
      )
    });
    vesselmarker.setStyle(this.getVesselStyle(vesselInfo));
    featureRoutes.push(vesselmarker);

    //Port Glow

    //Get Port Data
    let portData;
    // this.localService.getCountriesList().subscribe(res => {
    //   if (res != undefined) {
    for (const port of this.portList) {
      // if (ind == 0) {
      if (
        port.locationName == routes.startLocation &&
        routes.vesselName == routes.nextLocation
      ) {
        const portGlow = new OlFeature({
          id: 'PI' + routes.id,
          type: 'port-on-route',
          data: port,
          geometry: new OlPoint(
            fromLonLat([
              routes.startLocationLongitude,
              routes.startLocationLatitude
            ])
          )
        });
        portGlow.setStyle(this.getPortGlowStyle(port.flag));
        featureRoutes.push(portGlow);

        const portMarker = new OlFeature({
          id: 'PM' + routes.id,
          type: 'port-marker',
          data: port,
          geometry: new OlPoint(
            fromLonLat([
              routes.startLocationLongitude,
              routes.startLocationLatitude
            ])
          )
        });
        portMarker.setStyle(this.getPortMarkerStyle(routes.startLocation));
        featureRoutes.push(portMarker);

        this.routeLayer.getSource().addFeatures(featureRoutes);
        this.routeLayer.setVisible(true);
      }
      // }
      if (port.locationName == routes.nextLocation) {
        portData = port;
        if (this.nextPortIndex == ind) {
          const portGlow = new OlFeature({
            id: 'NP' + routes.id,
            type: 'next-port',
            data: port,
            geometry: new OlPoint(
              fromLonLat([
                routes.nextLocationLongitude,
                routes.nextLocationLatitude
              ])
            )
          });
          portGlow.setStyle(this.getNextPortStyle('blue'));
          featureRoutes.push(portGlow);

          const portMarker = new OlFeature({
            id: 'PM' + routes.id,
            type: 'port-marker',
            data: port,
            geometry: new OlPoint(
              fromLonLat([
                routes.nextLocationLongitude,
                routes.nextLocationLatitude
              ])
            )
          });
          portMarker.setStyle(this.getPortMarkerStyle(routes.nextLocation));
          featureRoutes.push(portMarker);
        } else {
          const portGlow = new OlFeature({
            id: 'PI' + routes.id,
            type: 'port-on-route',
            data: port,
            geometry: new OlPoint(
              fromLonLat([
                routes.nextLocationLongitude,
                routes.nextLocationLatitude
              ])
            )
          });
          portGlow.setStyle(this.getPortGlowStyle(port.flag));
          featureRoutes.push(portGlow);
        }

        const portMarker = new OlFeature({
          id: 'PM' + routes.id,
          type: 'port-marker',
          data: port,
          geometry: new OlPoint(
            fromLonLat([
              routes.nextLocationLongitude,
              routes.nextLocationLatitude
            ])
          )
        });
        portMarker.setStyle(this.getPortMarkerStyle(routes.nextLocation));
        featureRoutes.push(portMarker);
        this.routeLayer.getSource().addFeatures(featureRoutes);
        this.routeLayer.setVisible(true);
        this.setMapOpacity(0.3);
        this.vesselMakersLayer.setOpacity(0.3);
        this.portMakersLayer.setOpacity(0.3);
        break;
      }
    }
    // }
    // });
  }

  /**
   *
   * @param clat : Current/vessel location latitude
   * @param clon : Current/vessel location longitude
   * @param elat : End location latitude
   * @param elon : End location longitude
   */
  getRotationForVessel(clat, clon, elat, elon) {
    const x2 = clat;
    const x1 = elat;
    const y2 = clon;
    const y1 = elon;
    const radians = Math.atan2(y1 - y2, x1 - x2);

    const compassReading = radians * (180 / Math.PI);

    const coordNames = [0, 0.75, 1.5, 2, 3.05, 4, 4.75, 5.25, 0];
    // var coordNames = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    let coordIndex = Math.round(compassReading / 45);
    if (coordIndex < 0) {
      coordIndex = coordIndex + 8;
    }
    return coordNames[coordIndex];
  }

  mapZoom(iszoomIn) {
    if (iszoomIn) this.map.getView().setZoom(this.map.getView().getZoom() + 1);
    else this.map.getView().setZoom(this.map.getView().getZoom() - 1);
    this.checkZoomLimit();
  }

  checkZoomLimit() {
    if (this.map.getView().getZoom() >= this.maxZoomLevel) {
      //Maximized to limit
      this.maxZoomLimit = true;
    } else if (this.map.getView().getZoom() < 4) {
      //this.minZoomLevel){
      //Minimized to limit
      this.minZoomLimit = true;
    } else {
      this.maxZoomLimit = false;
      this.minZoomLimit = false;
    }
  }
  setCenter() {
    const lonlat = fromLonLat([10, 10]);
    this.flyTo(
      lonlat,
      () => {
        this.isLoading = false;
      },
      3
    );
  }

  // var bern = fromLonLat([7.4458, 46.95]);
  //MOVE TO THE LOCATION
  flyTo(location, done, zoom) {
    const duration = 200; //2000
    // var zoom = this.map.getView().getZoom();
    var zoom = zoom ? zoom : this.map.getView().getZoom();
    let parts = 1;
    let called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    this.map.getView().animate(
      {
        center: location,
        duration: duration
      },
      callback
    );

    if (zoom != this.map.getView().getZoom()) {
      this.map.getView().animate(
        {
          zoom: zoom,
          duration: duration / 2
        },
        callback
      );
    }
  }

  closeOverlayPopup() {
    this.showFullVesselInfo1 = false;
    this.showFullLocationInfo1 = false;
    setTimeout(() => {
      this.showFullVesselInfo = false;
      this.showFullLocationInfo = false;
    }, 1000);
  }

  getCurrentTime(): string {
    const d = new Date(); // for now
    this.lastUpdatedOn =
      'Today ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }

  animate() {
    // this.animationState = false;
    // this.isAnimate = true;
    this.showFullVesselInfo1 = true;

    this.showFullLocationInfo1 = true;
    this.showFullLocationInfo = true;
    this.showFullVesselInfo = true;

    //this.showFullVesselInfo1 = true;
    // setTimeout(() => {
    //   this.animationState = true;
    //   this.animationWithState = !this.animationWithState;
    // }, 1);
  }

  showBplan(value) {
    this.isBunkerPlanOpen = value;
    this.showBunkerPlan.emit(value);
  }
  showRoutes(value) {
    this.displayRoute = value;
    this.localService.setRouteFlag(value);
    let selectedVessel;
    if (this.vesselPopData.vesselId) {
      selectedVessel = this.vesselListWithImo.find(
        vessel => vessel.id == this.vesselPopData.vesselId
      );
      if (!selectedVessel?.imono) {
        return;
      }
    }
    const req = { VesselImo: selectedVessel?.imono }; //'9085546' };
    this.vesselService.getVesselRouteData(req).subscribe(res => {
      this.routeData = res.payload;
      if (this.routeData.length > 0) {
        const locations = {
          start_location_name: this.routeData[0].startLocation,
          start_location_id: this.routeData.startLocationId,
          end_location_name: this.routeData[0].nextLocation,
          end_location_id: this.routeData.nextLocationId
        };
        this.drawRoute(this.routeData, locations);
        this.openRoutes.emit(value);
        this.showLocationPop = false;
        this.showPortList = [];
        this.localService.setPortPopupData(this.showPortList);
      }
    });
  }
  showPortInfo(value) {
    this.showPortInfoScreen.emit(value);
    this.isPortInfoOpen = value;
  }
  closeVesselPopup() {
    this.SavemyDefaultView();
    this.clickedPort = '';
    const e = document.getElementsByClassName('ol-popup');
    for (let i = 0; i < e.length; i++) {
      e[i].remove();
    }
    this.logger.logInfo('OlMapComponent-vesselClose', new Date());
    this.popupCount = this.showPortList.length;
    if (this.displayRoute) {
      this.showLocationPop = false;
      this.showPortList = [];
    }
    if (!this.showLocationPop) {
      this.setMapOpacity(1);
      this.vesselMakersLayer.setOpacity(1);
      this.portMakersLayer.setOpacity(1);
      this.highIntensity = true;
      this.lightclick = false;
      this.mapLayer_click_dark_layer.setOpacity(0);
    }
    this.routeLayer.getSource().clear(); //to clear the route
    this.showVesselPop = false;
    this.displayRoute = false;
    this.localService.setRouteFlag(false);
    this.nextPortIndex = -1;
    this.routeFound = false;
  }
  closeLocationPopup(event) {
    this.SavemyDefaultView();
    this.clickedPort = '';
    const e = document.getElementsByClassName('ol-popup');
    for (let i = 0; i < e.length; i++) {
      e[i].remove();
    }
    this.routeLayer.getSource().clear(); //to clear the route
    this.nextPortIndex = -1;
    this.routeFound = false;
    this.showPortList = this.showPortList.filter(port => port.name != event);
    this.localService.setPortPopupData(this.showPortList);
    if (this.displayRoute) {
      this.showVesselPop = false;
      this.showPortList = [];
      this.showLocationPop = false;
    }
    this.displayRoute = false;
    this.localService.setRouteFlag(false);
    if (this.showVesselPop) {
      this.popupCount = this.showPortList.length + 1;
    } else {
      this.popupCount = this.showPortList.length;
    }
    if (this.showPortList.length <= 0) {
      this.showLocationPop = false;
    }
    if (!this.showVesselPop && !this.showLocationPop) {
      this.setMapOpacity(1);
      this.vesselMakersLayer.setOpacity(1);
      this.portMakersLayer.setOpacity(1);
      this.highIntensity = true;
      this.lightclick = false;
      this.mapLayer_click_dark_layer.setOpacity(0);
    }
  }

  showVessel(data) {
    if (this.showPortList.length != 3) {
      this.highIntensity = false;
      this.setdata(data);
      this.setMapOpacity(0.3);
      this.vesselMakersLayer.setOpacity(0.3);
      this.portMakersLayer.setOpacity(0.3);
    }
  }

  showPort(data) {
    this.highIntensity = false;
    this.setPortData(data);
    this.showLocationPop = true;
    this.setMapOpacity(0.3);
    this.vesselMakersLayer.setOpacity(0.3);
    this.portMakersLayer.setOpacity(0.3);
  }

  overlayClick() {
    if (!this.isBunkerPlanEdited) {
      this.showBplan(false);
      this.showPortInfo(false);
    } else if (!this.displayRoute) {
      const dialogRef = this.dialog.open(WarningComponent, {
        panelClass: ['confirmation-popup']
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if (result == false) {
          this.showBplan(false);
          this.localService.setBunkerPlanState(false);
        } else {
          this.showBplan(true);
        }
      });
    }
  }
  getDefaultView() {
    const req = { UserId: this.store.selectSnapshot(UserProfileState.userId) };
    this.vesselService.getmyDefaultview(req).subscribe(res => {
      this.vesselService.myDefaultViewPayload = [];
      this.vesselService.APImyDefaultView = [];
      // debugger;
      if (res.payload.length > 0) {
        this.vesselService.myDefaultViewPayload = res.payload[0];
      } else {
        if (this.vesselService.myDefaultViewPayload.length == 0) {
          this.vesselService.myDefaultViewPayload.userId = this.store.selectSnapshot(
            UserProfileState.userId
          );
          this.vesselService.myDefaultViewPayload.port = 0;
          this.vesselService.myDefaultViewPayload.vessel = 0;
          this.vesselService.myDefaultViewPayload.defaultView = 0;
          this.vesselService.myDefaultViewPayload.bunkerPlan = 0;
          this.vesselService.myDefaultViewPayload.portRemarks = 0;
          this.vesselService.myDefaultViewPayload.productAvailability = 0;
          this.vesselService.myDefaultViewPayload.bopsPrice = 0;
          this.vesselService.myDefaultViewPayload.portsAgents = 0;
          this.vesselService.myDefaultViewPayload.otherDetails = 0;
          this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
          this.vesselService.myDefaultViewPayload.futureRequest = 0;
          this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
          this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
          this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 0;
          this.vesselService.myDefaultViewPayload.comments = 0;
          this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 0;
          this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 0;
        }
      }
    });
  }

  SavemyDefaultView() {
    console.log(
      '======Final Payload===========',
      this.vesselService.myDefaultViewPayload
    );
    let requestPayload = {};
    requestPayload = {
      Payload: {
        UserId: this.vesselService.myDefaultViewPayload.userId,
        Port: this.vesselService.myDefaultViewPayload.port,
        Vessel: this.vesselService.myDefaultViewPayload.vessel,
        DefaultView: this.vesselService.myDefaultViewPayload.defaultView,
        BunkerPlan: this.vesselService.myDefaultViewPayload.bunkerPlan,
        PortRemarks: this.vesselService.myDefaultViewPayload.portRemarks,
        ProductAvailability: this.vesselService.myDefaultViewPayload
          .productAvailability,
        BOPSPrice: this.vesselService.myDefaultViewPayload.bopsPrice,
        PortsAgents: this.vesselService.myDefaultViewPayload.portsAgents,
        OtherDetails: this.vesselService.myDefaultViewPayload.otherDetails,
        VesselAlerts: this.vesselService.myDefaultViewPayload.vesselAlerts,
        FutureRequest: this.vesselService.myDefaultViewPayload.futureRequest,
        VesselRedelivery: this.vesselService.myDefaultViewPayload
          .vesselRedelivery,
        VesselSchedule: this.vesselService.myDefaultViewPayload.vesselSchedule,
        CurrentROBandArbitragedetails: this.vesselService.myDefaultViewPayload
          .currentROBandArbitragedetails,
        Comments: this.vesselService.myDefaultViewPayload.comments,
        CurrentBunkeringPlan: this.vesselService.myDefaultViewPayload
          .currentBunkeringPlan,
        PreviousBunkeringPlan: this.vesselService.myDefaultViewPayload
          .previousBunkeringPlan
      }
    };
    this.vesselService.saveDefaultView(requestPayload).subscribe(response => {
      console.log(response.payload);
      this.vesselService.myDefaultViewPayload = [];
      this.vesselService.APImyDefaultView = [];
      if (response.payload[0].success == 1) {
        this.getDefaultView();
      }
    });
  }

  setOverlayMapColor() {
    countryText.fill_.color_ = '#808C92';
  }
  removeOverlayMapColor() {
    countryText.fill_.color_ = '#C8D7D4';
  }
  private loadVessels(filter) {
    this.isLoading = true;
    this.vesselMakersLayer.getSource().clear();
    if (filter == ' ') {
      this.createVesselMakeSrs(this.vesselList);
    } else if (filter == 'Unmanageable Vessels') {
      this.createVesselMakeSrs(
        this.vesselList.filter(item => item.isUnmanagable == 1),
        true
      );
    } else {
      this.createVesselMakeSrs(
        this.vesselList.filter(item => item.regionName == filter),
        true
      );
    }
  }

  //Hover Circle Style
  private getHoverVesselCircle(vesselDetail?): Style {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.47, 0.47],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: this.getRotationForVessel(
          vesselDetail.vesselLatitude,
          vesselDetail.vesselLongitude,
          vesselDetail.destinationLatitude,
          vesselDetail.destinationLongitude
        ),
        src: './assets/customicons/vessel/hover-blue.svg' //vesselDetail.ROB.Color.indexOf('orange') > 0 ? "./assets/customicons/vessel/hover-amber.svg" : vesselDetail.ROB.Color.indexOf('red') > 0 ? "./assets/customicons/vessel/hover-red.svg" : "./assets/customicons/vessel/hover-blue.svg",
      })
    });
    return iconStyle;
  }

  //Hover Circle Style
  private getHoverPortCircle(portDetail?): Style {
    const iconStyle = new Style({
      image: new Icon({
        rotation: 0,
        anchor: [0.8, 0.8],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './assets/customicons/port/hover' + '-blue' + '.svg' //+ (portDetail.flag == 'higher-warning-view' ? '-red' : (portDetail.flag == 'minor-warning-view' ? '-amber' : '-blue')) + '.svg', //portType -major:minor
      })
    });
    return iconStyle;
  }

  //Vessel Style
  private getVesselStyle(vesselDetail): Style {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.47, 0.47],
        anchorOrigin: 'bottom-left',
        // anchorXUnits: 'pixels',
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: this.getRotationForVessel(
          vesselDetail.vesselLatitude,
          vesselDetail.vesselLongitude,
          vesselDetail.destinationLatitude,
          vesselDetail.destinationLongitude
        ),
        // src: "http://cdn.mapmarker.io/api/v1/pin?text=P&size=50&hoffset=1",
        // src: vesselDetail.ColorFlag == 0 ? "./assets/icon/ROB_blue.svg" : vesselDetail.ColorFlag == 1 ? "./assets/icon/ROB_red.svg" : "./assets/icon/ROB_amber.svg",
        src: './assets/customicons/vessel/ROB_blue.svg' //vesselDetail.ROB.Color.indexOf('orange') > 0 ? "./assets/icon/ROB_amber.svg" : vesselDetail.ROB.Color.indexOf('red') > 0 ? "./assets/icon/ROB_red.svg" : "./assets/icon/ROB_blue.svg",
      })
    });
    return iconStyle;
  }

  private getVesselStyle1(vesselDetail): Style {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.47, 0.47],
        anchorOrigin: 'bottom-left',
        // anchorXUnits: 'pixels',
        zIndex: Infinity,
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: this.getRotationForVessel(
          vesselDetail.vesselLatitude,
          vesselDetail.vesselLongitude,
          vesselDetail.destinationLatitude,
          vesselDetail.destinationLongitude
        ),
        src:
          vesselDetail.ROB.Color.indexOf('orange') > 0
            ? './assets/icon/ROB_amber.svg'
            : vesselDetail.ROB.Color.indexOf('red') > 0
            ? './assets/icon/ROB_red.svg'
            : './assets/icon/ROB_blue.svg'

        // src: "./assets/icon/ROB_red.svg",
        // src: "./assets/customicons/vessel/ROB_amber_hover_3.svg",
      })
    } as any);
    return iconStyle;
  }

  private getGreyVesselStyle(vesselDetail): Style {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.47, 0.47],
        opacity: 1,
        anchorOrigin: 'bottom-left',
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: this.getRotationForVessel(
          vesselDetail.vesselLatitude,
          vesselDetail.vesselLongitude,
          vesselDetail.destinationLatitude,
          vesselDetail.destinationLongitude
        ),
        src: './assets/customicons/vessel/vessel_grey.svg'
      })
    });
    return iconStyle;
  }

  private getVesselGlowStyle(color): Style {
    if (color == 'grey') {
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: './assets/images/glow_' + color + '.svg',
          opacity: 0.2,
          anchorOrigin: 'bottom-left',
          scale: 1.4
        })
      });
      return iconStyle;
    } else {
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: './assets/images/glow_' + color + '.svg',
          opacity: 0.8,
          anchorOrigin: 'bottom-left'
        })
      });
      return iconStyle;
    }
  }

  private getPortGlowStyle(flag): Style {
    if (flag == -1) {
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.75, 0.35],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: './assets/customicons/port/start-grey.svg',
          opacity: 1,
          anchorOrigin: 'bottom-left',
          scale: 1
        })
      });
      return iconStyle;
    } else {
      var iconStyle = new Style({
        // image: new Icon(({
        //   anchor: [0.8, 0.15],
        //   anchorXUnits: 'fraction',
        //   anchorYUnits: 'fraction',
        //  src: './assets/customicons/port/major-port' + (flag == 'higher-warning-view' ? '-red' : (flag == 'minor-warning-view' ? '-amber' : '-blue')) + '.png', //portType -major:minor

        //   //src: './assets/customicons/port/start' + (flag == 'higher-warning-view' ? '-red' : (flag == 'minor-warning-view' ? '-amber' : '-blue')) + '.svg',
        //   opacity: 0.65,
        //   anchorOrigin: 'bottom-left',
        //   scale: 0.45
        // })),
        image: new Icon({
          anchor: [0.8, 0.35],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src:
            './assets/customicons/port/start' +
            (flag == 'higher-warning-view'
              ? '-red'
              : flag == 'minor-warning-view'
              ? '-amber'
              : '-blue') +
            '.svg',
          opacity: 0.85,
          anchorOrigin: 'bottom-left',
          scale: 1
        })
      });
      return iconStyle;
    }
  }

  private getNextPortStyle(color): Style {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.69, 0.05],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './assets/customicons/port/end-' + color + '.svg',
        opacity: 1,
        anchorOrigin: 'bottom-left',
        scale: 1.5
      })
    });
    return iconStyle;
  }

  private getPortStyle(name, isMajorPort, flag): Style {
    const iconStyle = new Style({
      image: new Icon({
        src:
          './assets/customicons/port/' +
          (isMajorPort == 1
            ? 'major-port-blue.png'
            : 'new/minor-port-blue.svg'), //(flag == 'higher-warning-view' ? '-red' : (flag == 'minor-warning-view' ? '-amber' : '-blue')) + '.png', //portType -major:minor
        rotation: 0,
        anchor: [1, 1],
        // scale: -1,
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        scale: isMajorPort == 1 ? 0.3 : 0.1
      })
      // text: new Text({
      //   offsetY: 10,
      //   offsetX: 10,
      //   // padding:[50,50,50,50],
      //   text: name,
      //   // scale: 1.2,
      //   fill: new Fill({
      //     color: "#37414F"
      //   })
      // })
    });
    return iconStyle;
  }

  //Styles -ends

  //Events - start
  private loadEventListeners() {
    let hoverItems: any;
    //EVENTS
    //MAP - pointermove
    this.map.on('pointermove', event => {
      if (hoverItems != null && hoverItems.length > 0)
        this.resetHoverItems(hoverItems);
      const pixel = this.map.getEventPixel(event.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      var coordinates = event.coordinate;
      if (hit) {
        hoverItems = this.map.getFeaturesAtPixel(pixel);
        if (
          hoverItems[0].get('type') == 'vessel' ||
          hoverItems[0].get('type') == 'vessel-glow'
        ) {
          //  hoverItems[0].setStyle(this.getVesselStyle1(hoverItems[0].get('data')));
          this.map.getViewport().style.cursor = this.displayRoute
            ? ''
            : 'pointer';
          var coordinates = event.coordinate;
          this.hoverVesselName = hoverItems[0].get('data').vesselName;
          this.hoverVesselColor = 'blue'; //hoverItems[0].get('data').ROB.Color.indexOf('red') > 0 ? 'red' :
          //hoverItems[0].get('data').ROB.Color.indexOf('orange') > 0 ? 'yellow' : 'blue';
          // this.view = hoverItems[0].get('data').ROB.Color.indexOf('red') > 0 ? 'higher-warning-view' :
          // hoverItems[0].get('data').ROB.Color.indexOf('orange') > 0 ? 'minor-warning-view' : 'standard-view';
          this.map.getViewport().style.cursor = this.displayRoute
            ? ''
            : 'pointer';
          // this.vesselHoverPopupOverlay.setPosition(hoverItems[0].get('geometry').flatCoordinates);
          if (hoverItems[0].get('type') != 'vessel-glow')
            hoverItems[0].setStyle(
              this.getHoverVesselCircle(hoverItems[0].get('data'))
            );
          this.vesselHoverPopupOverlay.setPosition(coordinates);
          this.portHoverPopupOverlay.setPosition(undefined);
          this.hoverCircleEffectOverlay.setPosition(undefined);
          const titleEle = document.getElementsByClassName(
            'page-title'
          )[0] as HTMLElement;
          titleEle.click();
        } else if (hoverItems[0].get('type') == 'port') {
          this.hoverPortName = hoverItems[0].get('data').locationName;
          this.map.getViewport().style.cursor = this.displayRoute
            ? ''
            : 'pointer';
          this.hoverPopupColor = 'blue'; //hoverItems[0].get('data').flag == 'minor-warning-view' ? 'yellow' : (hoverItems[0].get('data').flag == 'higher-warning-view') ? 'red' : 'blue';
          hoverItems[0].setStyle(
            this.getHoverPortCircle(hoverItems[0].get('data'))
          );
          this.portHoverPopupOverlay.setPosition(coordinates);
          this.vesselHoverPopupOverlay.setPosition(undefined);
          this.hoverCircleEffectOverlay.setPosition(undefined);
          const titleEle = document.getElementsByClassName(
            'page-title'
          )[0] as HTMLElement;
          titleEle.click();
        } else if (
          hoverItems[0].get('type') == 'port-on-route' ||
          hoverItems[0].get('type') == 'next-port' ||
          hoverItems[0].get('type') == 'vessel-on-route'
        ) {
          this.map.getViewport().style.cursor = 'pointer';
          if (
            hoverItems[0].get('type') == 'port-on-route' ||
            hoverItems[0].get('type') == 'next-port'
          ) {
            this.createHoverPopup(hoverItems[0].get('data'), coordinates);
          }
        } else {
          this.vesselHoverPopupOverlay.setPosition(undefined);
          this.portHoverPopupOverlay.setPosition(undefined);
          this.hoverCircleEffectOverlay.setPosition(undefined);
          this.map.getViewport().style.cursor = '';
        }
      } else {
        this.vesselHoverPopupOverlay.setPosition(undefined);
        this.portHoverPopupOverlay.setPosition(undefined);
        this.hoverCircleEffectOverlay.setPosition(undefined);
        this.map.getViewport().style.cursor = '';
      }
    });

    //MAP - click
    this.map.on('click', evt => {
      const coordinates = evt.coordinate;
      // console.log(coordinates)
      // this.flyTo(coordinates, () => { this.isLoading = false }, 3)
      if (hoverItems != null && hoverItems.length > 0)
        this.resetHoverItems(hoverItems);
      const pixel = this.map.getEventPixel(evt.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      //Check Bunker Plan Screen is open
      this.onMapClick.emit();
      //debugger;
      if (this.vesselService.myDefaultViewPayload.bunkerPlan != undefined) {
        this.getDefaultView(); //this.SavemyDefaultView();
      }
      if (hit) {
        const items = this.map.getFeaturesAtPixel(pixel);
        // this.routePopupOverlay.setPosition(evt.coordinate);
        // console.log(evt.coordinate)

        if (
          items[0].get('type') == 'vessel' ||
          items[0].get('type') == 'vessel-glow'
        ) {
          if (!this.displayRoute) {
            this.logger.logInfo('OlMapComponent-vesselClick', new Date());
            if (this.showPortList.length != 3) {
              this.isLoading = true;
              this.highIntensity = false;
              this.setdata(items[0].get('data'));
              if (this.theme) {
                this.setMapOpacity(0.4);
              } else {
                this.lightclick = true;
                this.mapLayer_click_dark_layer.setOpacity(1);
                // this.setMapOpacity(0.5);
              }

              //this.setMapOpacity(0.3);
              this.vesselPopupIsVisible = true;
              let flag;
              this.vesselMakersLayer.setOpacity(0.3);
              this.portMakersLayer.setOpacity(0.3);
            }
          }
          this.clickedPort = '';
          var e = document.getElementsByClassName('ol-popup');
          for (let i = 0; i < e.length; i++) {
            e[i].remove();
          }
        } else if (items[0].get('type') == 'vessel-on-route') {
          this.clickedPort = '';
          var e = document.getElementsByClassName('ol-popup');
          for (let i = 0; i < e.length; i++) {
            e[i].remove();
          }
          this.showLocationPop = false;
          this.showPortList = [];
          this.showVesselPop = true;
          const feature1 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.id == 'RL');
          const feature2 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'port-on-route'); //Port Icon on Route
          const feature3 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'vessel-glow'); //Vessel Icon Glow on Route
          const feature4 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'vessel-on-route'); //Vessel Icon on Route
          const feature5 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'next-port'); //Next Port Icon on Route
          feature1.forEach(element => {
            const sty = element.getStyle() as any;
            sty.stroke_.color_ = this.strokeColor;
            element.setStyle(sty);
          });

          feature2.forEach(element => {
            element.setStyle(
              this.getPortGlowStyle(element.getProperties().data.flag)
            );
          });

          feature3.forEach(element => {
            element.setStyle(this.getVesselGlowStyle('amber'));
          });

          feature4.forEach(element => {
            element.setStyle(this.getVesselStyle(element.getProperties().data));
          });

          feature5.forEach(element => {
            element.setStyle(this.getNextPortStyle('amber'));
          });
        } else if (items[0].get('type') == 'port') {
          this.logger.logInfo('OlMapComponent-portClick', new Date());
          if (!this.displayRoute) {
            if (this.showVesselPop) {
              this.showPortCount = this.displayRoute ? 1 : 2;
            } else this.showPortCount = 3;
            this.highIntensity = false;
            this.setPortData(items[0].get('data'));
            this.showLocationPop = true;
            //this.showVesselPop = false;
            this.vesselMakersLayer.setOpacity(0.3);
            this.portMakersLayer.setOpacity(0.3);
            if (this.theme) {
              this.setMapOpacity(0.4);
            } else {
              this.lightclick = true;
              this.mapLayer_click_dark_layer.setOpacity(1);
              // this.setMapOpacity(0.5);
            }
          }
          this.clickedPort = '';
          var e = document.getElementsByClassName('ol-popup');
          for (let i = 0; i < e.length; i++) {
            e[i].remove();
          }
        } else if (
          items[0].get('type') == 'port-on-route' ||
          items[0].get('type') == 'next-port'
        ) {
          // this.createPopup(items[0].get('data'), coordinates);
          const feature1 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.id == 'RL'); //Route Line
          const feature3 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'vessel-glow'); //Vessel Icon Glow on Route
          const feature4 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'vessel-on-route'); //Vessel Icon on Route
          const feature5 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'next-port'); //Next Port Icon on Route
          const feature2 = this.routeLayer
            .getSource()
            .getFeatures()
            .filter((ele: any) => ele.values_.type == 'port-on-route'); //Port Icon on Route

          feature1.forEach(element => {
            const sty = element.getStyle() as any;
            sty.stroke_.color_ = '#BBBDBF';
            element.setStyle(sty);
          });

          feature3.forEach(element => {
            element.setStyle(this.getVesselGlowStyle('grey'));
          });

          feature4.forEach(element => {
            element.setStyle(
              this.getGreyVesselStyle(element.getProperties().data)
            );
          });

          feature5.forEach(element => {
            if (
              items[0].get('data').locationName !=
              element.getProperties().data.locationName
            )
              element.setStyle(this.getNextPortStyle('grey'));
            else element.setStyle(this.getNextPortStyle('amber'));
          });

          feature2.forEach(element => {
            if (
              items[0].get('data').locationName !=
              element.getProperties().data.locationName
            )
              element.setStyle(this.getPortGlowStyle(-1));
            else
              element.setStyle(
                this.getPortGlowStyle(element.getProperties().data.flag)
              );
          });

          this.setPortData(items[0].get('data'));
          this.showVesselPop = false;
          this.showLocationPop = true;
        } else {
          //Retain popup even on close of Bunker plan
          if (!this.displayRoute) {
            if (
              !(
                this.isBunkerPlanOpen &&
                (this.showVesselPop || this.showLocationPop)
              )
            ) {
              this.showLocationPop = false;
              this.showVesselPop = false;
              this.showPortList = [];
              this.localService.setPortPopupData(this.showPortList);
              this.showPortCount = 0;
              this.routeLayer.setVisible(false);
              this.setMapOpacity(1);
              this.vesselMakersLayer.setOpacity(1);
              this.portMakersLayer.setOpacity(1);
              this.highIntensity = true;
            }
          }
          var e = document.getElementsByClassName('ol-popup');
          for (let i = 0; i < e.length; i++) {
            e[i].remove();
          }
        }
      } else {
        this.clickedPort = '';
        var e = document.getElementsByClassName('ol-popup');
        for (let i = 0; i < e.length; i++) {
          e[i].remove();
        }
        if (!this.displayRoute) {
          if (
            !(
              this.isBunkerPlanOpen &&
              (this.showVesselPop || this.showLocationPop)
            )
          ) {
            this.showLocationPop = false;
            this.showVesselPop = false;
            this.showPortList = [];
            this.localService.setPortPopupData(this.showPortList);
            this.showPortCount = 0;
            this.routeLayer.setVisible(false);
            this.setMapOpacity(1);
            this.vesselMakersLayer.setOpacity(1);
            this.portMakersLayer.setOpacity(1);
            this.highIntensity = true;
          }
        }
        // }
      }
      this.showBplan(false);
    });
    //MAP - singleclick
    this.map.on('singleclick', function(event) {
      const coordinate = event.coordinate;
    });

    this.map.on('moveend', evt => {
      if (this.isRegionFilterSelected == false) {
        if (
          evt.map.getView().getZoom() >= 4 &&
          evt.map.getView().getZoom() < 5
        ) {
          //Vessels + Major Ports
          this.portMakersLayer.getSource().clear();
          const majorPortList = this.portList.filter(
            port => port.isMajorLocation == 1
          );
          this.createPortMakeSrs(majorPortList);
        } else if (
          evt.map.getView().getZoom() >= 5 &&
          evt.map.getView().getZoom() < 6
        ) {
          //Vessels + Major Ports + Minor Ports
          this.portMakersLayer.getSource().clear();
          this.createPortMakeSrs(this.portList);
        } else if (
          evt.map.getView().getZoom() >= 6 &&
          evt.map.getView().getZoom() < 13
        ) {
          //Vessels + Major Ports + Minor Ports without reseting portMakersLayer Source
          this.portMakersLayer.setVisible(true);
        } else this.portMakersLayer.setVisible(false); // Vessel only
      } else {
        if (
          evt.map.getView().getZoom() >= 4 &&
          evt.map.getView().getZoom() < 5
        ) {
          //Region Based Vessels + Major ports
          this.portMakersLayer.getSource().clear();
          const majorPortList = this.portList.filter(
            port =>
              port.isMajorLocation == 1 &&
              port.regionName == this.regionFilterType
          );
          this.createPortMakeSrs(majorPortList);
        } else if (
          evt.map.getView().getZoom() >= 5 &&
          evt.map.getView().getZoom() < 6
        ) {
          //Region Based Vessels + Major Ports + Minor Ports
          this.portMakersLayer.getSource().clear();
          this.loadPorts(this.regionFilterType);
        } else if (
          evt.map.getView().getZoom() >= 6 &&
          evt.map.getView().getZoom() < 13
        ) {
          //Region Based Vessels + Major Ports + Minor Ports
          this.portMakersLayer.setVisible(true);
        } else this.portMakersLayer.setVisible(false); // Vessel only
      }

      this.checkZoomLimit();
    });

    this.map.on('movestart', evt => {
      if (evt.map.getView().getZoom() >= 4) {
        //on map dragged or moved.
        this.portMakersLayer.setVisible(true);
      } else this.portMakersLayer.setVisible(false);

      this.checkZoomLimit();
    });

    this.vesselMakersLayer.getSource().on('addfeature', evt => {});
  }

  private loadRoute() {
    // var route = new OlFeature();
    // var coordinates = [[2.173403, 40.385064], [2.273403,41.385064]];
    // var geometry = new LineString(coordinates);
    // geometry.transform('EPSG:4326', 'EPSG:3857'); //Transform to your map projection
    // route.setGeometry(geometry);
    // this.routeLayer.getSource().addFeature(route);
  }
}

//Styles 9aadaa
var countryText = new Style({
  fill: new Fill({
    color: '#C8D7D4'
  }),
  stroke: new Stroke({
    color: '#9C9C9C',
    width: 0.5
  }),
  text: new Text({
    font: '11px Calibri,sans-serif',
    fill: new Fill({
      color: '#424a57'
    })
  })
}) as any;

var countryText_dark_click = new Style({
  fill: new Fill({
    color: '#58646e'
  }),
  stroke: new Stroke({
    color: '#505a64',
    width: 0.5
  }),
  text: new Text({
    font: '11px Calibri,sans-serif',
    fill: new Fill({
      color: '#000000'
    })
    // stroke: new Stroke({
    //   color: '#ffffff',
    //   width: 2
    // }),
  })
}) as any;
var countryText_Dark = new Style({
  fill: new Fill({
    color: '#777F8C'
  }),
  stroke: new Stroke({
    color: '#5C6270',
    width: 0.5
  }),
  text: new Text({
    font: '11px Calibri,sans-serif',
    fill: new Fill({
      color: '#424a57'
    })
    // stroke: new Stroke({
    //   color: '#ffffff',
    //   width: 2
    // }),
  })
}) as any;
