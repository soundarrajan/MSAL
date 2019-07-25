import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'shiptech-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbItems: MenuItem[] = [{label: 'Home'}, {label: 'Another module'}, {label: 'Last module'}];
  constructor() { }

  ngOnInit() {
  }

}
