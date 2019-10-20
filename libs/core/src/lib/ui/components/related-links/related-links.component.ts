import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface IRelatedLinksRouteData {
  relatedLinks?: IRelatedLinksOptions
}

export interface IRelatedLinksOptions {
  links: MenuItem[],
  dynamicLinkProvider: Observable<Record<string, string>>
}

@Component({
  selector: 'shiptech-related-links',
  template: `
      <div [class]="styleClass" [ngStyle]="style"
           [ngClass]="'ui-related-links ui-widget ui-widget-header ui-helper-clearfix ui-corner-all'">
          <ul>
              <ng-template ngFor let-item let-end="last" [ngForOf]="model">
                  <li role="menuitem">
                      <a *ngIf="!item.routerLink" [href]="item.url||'#'" class="ui-menuitem-link"
                         (click)="itemClick($event, item)"
                         [ngClass]="{'ui-state-disabled':item.disabled}" [attr.target]="item.target"
                         [attr.title]="item.title" [attr.id]="item.id"
                         [attr.tabindex]="item.tabindex ? item.tabindex : '0'">
                          <span *ngIf="item.icon" class="ui-menuitem-icon" [ngClass]="item.icon"></span>
                          <span class="ui-menuitem-text">{{item.label}}</span>
                      </a>
                      <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams"
                         [routerLinkActive]="'ui-state-active'"
                         [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}"
                         class="ui-menuitem-link" (click)="itemClick($event, item)"
                         [ngClass]="{'ui-state-disabled':item.disabled}" [attr.target]="item.target"
                         [attr.title]="item.title" [attr.id]="item.id"
                         [attr.tabindex]="item.tabindex ? item.tabindex : '0'">
                          <span *ngIf="item.icon" class="ui-menuitem-icon" [ngClass]="item.icon"></span>
                          <span class="ui-menuitem-text">{{item.label}}</span>
                      </a>
                  </li>
              </ng-template>
          </ul>
      </div>
  `,
  styleUrls: ['./related-links.scss']
})
export class RelatedLinksComponent implements OnInit, OnDestroy {

  @Input() model: MenuItem[];

  @Input() style: any;

  @Input() styleClass: string;

  private _destroy$ = new Subject();

  constructor(private router: Router,
              private route: ActivatedRoute) {

    this.route.data.pipe(
      tap((data: IRelatedLinksRouteData) => {
        const options = (data || {}).relatedLinks || <IRelatedLinksOptions>{};

        this.model = (options.links || []);


      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  ngOnInit(): void {

  }

  itemClick(event, item: MenuItem) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
