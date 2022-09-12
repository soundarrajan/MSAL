import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-componets',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss']
})
export class ComponentsComponent implements OnInit {

  constructor() { }

  public filterData = [
    {
      name: 'All My Vessels',
      count: '200',
      color: '#476987'
    },
    {
      name: 'All Outstanding Requests',
      count: '50',
      color: '#476987'
    },
    {
      name: 'European Region',
      count: '15',
      color: '#476987'
    },
    {
      name: 'N.America Region',
      count: '0',
      color: '#476987'
    },
    {
      name: 'Asia Region',
      count: '0',
      color: '#476987'
    }
  ];

  ngOnInit() {
  }

}
