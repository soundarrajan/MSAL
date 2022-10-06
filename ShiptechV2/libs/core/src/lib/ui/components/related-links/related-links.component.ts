import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  EntityType,
  IEntityRelatedLink
} from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { EntityRelatedLinksService } from '@shiptech/core/services/entity-related-links/entity-related-links.service';
import { Omit } from '../../../utils/type-definitions';
import { MenuItem } from 'primeng/api';

export interface IRelatedLinksRouteData {
  relatedLinksOptions?: IRelatedLinksOptions;
}

export interface IRelatedLinksOptions {
  availableLinks: IRelatedLinkItem[];
  currentRouteEntityType?: EntityType;
  entityIdRouteParam?: string;
}

export interface IRelatedLinkItem extends Omit<MenuItem, 'id'> {
  id: EntityType;
  isActive?: boolean;
  isPreviousActive?: boolean;
}

@Component({
  selector: 'shiptech-related-links',
  templateUrl: './related-links.component.html',
  styleUrls: ['./related-links.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedLinksComponent implements OnInit, OnDestroy {
  @Input() model: IRelatedLinkItem[] = [];

  @Input() style: any;

  @Input() styleClass: string;

  private _destroy$ = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private entityRelatedLinksService: EntityRelatedLinksService
  ) {
    const options: IRelatedLinksOptions =
      (this.route.snapshot.data || {}).relatedLinksOptions ||
      <IRelatedLinksOptions>{};

    this.model = options.availableLinks || [];

    for (let i = 0; i < (this.model || []).length; i++) {
      if (this.model[i].id === options.currentRouteEntityType) {
        this.model[i].isActive =
          options.currentRouteEntityType === this.model[i].id;
        break;
      }
      this.model[i].isPreviousActive = true;
    }

    const entityId = this.route.snapshot.params[options.entityIdRouteParam];

    // TODO: Log invalid usage
    if (entityId)
      this.entityRelatedLinksService
        .getRelatedLinksForEntity(options.currentRouteEntityType, entityId)
        .pipe(
          tap(serverLinks =>
            (this.model || []).forEach(relatedLinkItem => {
              relatedLinkItem.url = (
                serverLinks.find(s => s.type === relatedLinkItem.id) ||
                <IEntityRelatedLink>{}
              ).url;
            })
          ),
          takeUntil(this._destroy$)
        )
        .subscribe();
  }

  ngOnInit(): void {}

  itemClick(event: any, item: MenuItem): void {
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
