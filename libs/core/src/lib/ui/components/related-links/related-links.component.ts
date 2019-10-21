import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  EntityRelatedLinkType,
  IEntityRelatedLink
} from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { EntityRelatedLinksService } from '@shiptech/core/services/entity-related-links/entity-related-links.service';
import { Omit } from '../../../utils/type-definitions';

export interface IRelatedLinksRouteData {
  relatedLinksOptions?: IRelatedLinksOptions,
}

export interface IRelatedLinksOptions {
  availableLinks: IRelatedLinkItem[],
  currentRouteLinkType?: EntityRelatedLinkType,
  entityIdRouteParam?: string
}

export interface IRelatedLinkItem  extends Omit<MenuItem, 'id'> {
  id: EntityRelatedLinkType;
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

  @Input() model: IRelatedLinkItem[];

  @Input() style: any;

  @Input() styleClass: string;

  private _destroy$ = new Subject();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private entityRelatedLinksService: EntityRelatedLinksService) {

    const options = (this.route.snapshot.data || {}).relatedLinksOptions || <IRelatedLinksOptions>{};

    this.model = (options.availableLinks || []);

    const entityId = this.route.snapshot.params[options.entityIdRouteParam];

    // TODO: Log invalid usage
    if (entityId)
      this.entityRelatedLinksService.getRelatedLinksForEntity(entityId)
        .pipe(
          tap(serverLinks => {
            (this.model || []).forEach(relatedLinkItem => relatedLinkItem.url = (serverLinks.find(s => s.type === relatedLinkItem.id) || <IEntityRelatedLink>{}).url);
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
