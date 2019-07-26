import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, ActivationEnd, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'shiptech-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbItems: MenuItem[] = [{label: 'Home'}, {label: 'Another module'}, {label: 'Last module'}];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(e => e instanceof (NavigationEnd || ActivationEnd)),
      tap(e => {
        console.log('Activated route', this.activatedRoute.snapshot);
        // console.log(this.activatedRoute.routeConfig.data);
        // console.log(this.activatedRoute.pathFromRoot);
      })
    ).subscribe()
  }

  ngOnInit() {
  }

}
