//loader.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  public url = '';
  constructor(private router: Router) {}

  public getUrl() {
    let segments = this.router.getCurrentNavigation().extractedUrl.root.children
      .primary.segments;
    let url = '/v2/';
    for (let i = 0; i < segments.length; i++) {
      url = url + segments[i].path + '/';
    }
    url = url.substring(0, url.length - 1);
  }
}
