import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { ComponentRef, Inject } from '@angular/core';
import { ROUTES_TO_CACHE } from './routes-to-reuse.token';
import * as _ from 'lodash';
import { LoggerFactory } from '../logging/logger-factory.service';
import { ILogger } from '../logging/logger';

export class AppRouteReuseStrategy implements RouteReuseStrategy {
  private routeReuseLogger: ILogger;
  private _storedRouteHandles = new Map<string, DetachedRouteHandle>();

  constructor(@Inject(ROUTES_TO_CACHE) private routesToCache: string[], loggerFactory: LoggerFactory) {
    this.routeReuseLogger = loggerFactory.createLogger(AppRouteReuseStrategy.name);
  }

  // Specify the routes to reuse/cache in an array.
  get _routesToCache(): string[] {
    return _.flattenDeep(this.routesToCache);
  }

  get cachedRoutes(): Map<string, DetachedRouteHandle> {
    return this._storedRouteHandles;
  }

  public clearCachedRoutes(): void {
    const cachedKeys = [];
    this._storedRouteHandles.forEach((value, key) => cachedKeys.push(key));

    this.routeReuseLogger.info('Removed cached routes: {@Routes}', cachedKeys);

    this._storedRouteHandles.forEach((component: DetachedRouteHandle) => {
      (<ComponentRef<any>>component['componentRef']).destroy();
    });

    this._storedRouteHandles = new Map<string, DetachedRouteHandle>();
  }

  public removeCachedRoute(routeKey: string): void {
    this.routeReuseLogger.info('Removing cached route with key {@Key}', routeKey);
    const cachedComponent = this._storedRouteHandles.get(routeKey);

    // Note: Components detached are not destroyed. Force destroy
    // Note: See https://github.com/angular/angular/issues/16713
    if (cachedComponent) {
      (<ComponentRef<any>>cachedComponent['componentRef']).destroy();
    }
    this._storedRouteHandles.delete(routeKey);
  }

  // Note: This method is called everytime we navigate between routes.
  // If it returns FALSE then the routing happens and the rest of the methods are called.
  shouldReuseRoute(prev: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return prev.routeConfig === curr.routeConfig;
  }

  // Note: This method is called for the route just opened when we land on the component of this route.
  // Once component is loaded this method is called. If this method returns TRUE then retrieve method will be called,
  // otherwise the component will be created from scratch
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this._storedRouteHandles.has(this.getPath(route));
  }

  // Note: This method is called if shouldAttach returns TRUE, provides as parameter the current route (we just land),
  // and returns a stored RouteHandle. If returns null has no effects.
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // The store and retrieve methods are called twice regarding to bug https://github.com/angular/angular/issues/22474

    const detachedRouteHandle: DetachedRouteHandle = this._storedRouteHandles.get(this.getPath(route));

    if (!detachedRouteHandle) {
      return null;
    }

    // this.routeReuseLogger.info('Using cached route with path {@Path}', this.getPath(route));
    return detachedRouteHandle;
  }

  // It is invoked when we leave the current route. If returns TRUE then the store method will be invoked:
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this._routesToCache.indexOf(this.getPath(route)) > -1) {
      this.routeReuseLogger.info('Route with path {@Path} was cached', this.getPath(route));
    }
    return this._routesToCache.indexOf(this.getPath(route)) > -1;
  }

  // This method is invoked only if the shouldDetach returns true. We can manage here how to store the RouteHandle.
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // The store and retrieve methods are called twice regarding to bug https://github.com/angular/angular/issues/22474
    // this.routeReuseLogger.info('Storing the route with path {@Path}', this.getPath(route));
    this._storedRouteHandles.set(this.getPath(route), handle);
  }

  // Helper method to return a path, since javascript map object returns an object or undefined.
  private getPath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .filter(p => p.url)
      .map(p => p.url)
      .join('/');
  }
}
