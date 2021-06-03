import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleDashboardLabelsRouteResolverService implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private legacyLookupsDatabase: LegacyLookupsDatabase,

  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any{

    return  this.legacyLookupsDatabase.getScheduleDashboardLabelConfiguration();

  }

}
