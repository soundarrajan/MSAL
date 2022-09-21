import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  @Input('type') type;
  @Input('switchTheme') switchTheme;//false-Light Theme, true- Dark Theme
  public popupOpen: boolean;
  labellist = [
    {
      "title": "In-tank Product",
      "data": "Gasoil DPNMUR",
    },
    {
      "title": "Available Qty",
      "data": "1000.62 GAL",
    },
    {
      "title": "Utilised Qty",
      "data": "1000.62 GAL",
    }
  ]
  contentMap1 = [
    {
      "title": "Out Movement",
      "titleClass": "readonly-split-fields",
      "dataKeyClass": "value",
      "dataKey": "-",
    },
    {
      "title": "Status",
      "titleClass": "readonly-split-fields",
      "dataKeyClass": "status status-empty",
      "dataKey": "-",
    }
  ]
  contentMap2 = [
    {
      "title": "Out Movement",
      "titleClass": "readonly-split-fields",
      "dataKeyClass": "value",
      "dataKey": "17263",
    },
    {
      "title": "Status",
      "titleClass": "readonly-split-fields",
      "dataKeyClass": "status status-planned",
      "dataKey": "Planned",
    }
  ]
  contentMap3 = [
    {
      "title": "Out Movement",
      "titleClass": "readonly-split-fields",
      "dataKeyClass": "value",
      "dataKey": "17263",
    },
    {
      "title": "Status",
      "titleClass": "readonly-split-fields",
      "dataKeyClass": "status status-verified",
      "dataKey": "Verified",
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
