import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener
} from '@angular/core';
import { environment } from '@shiptech/environment';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterEvent
} from '@angular/router';
import { MyMonitoringService } from './service/logging.service';
import { LoaderService } from './service/loader.service';

@Component({
  selector: 'shiptech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  title = 'Shiptech';
  isProduction = environment.production;
  public isLoading = true;
  loading: boolean;
  loggedBootTime: any;
  firstApiCallStartTime: any;

  constructor(
    private router: Router,
    changeDetector: ChangeDetectorRef,
    private myMonitoringService: MyMonitoringService,
    private loaderService: LoaderService,
    private elementRef: ElementRef
  ) {

    router.events.subscribe((event: RouterEvent): void => {
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
          this.isLoading = false;
          setTimeout(()=>{
              if(!this.loggedBootTime) {
                  this.loggedBootTime = true;
                  var loadTime = Date.now() - performance.timing.connectStart; 
                  this.myMonitoringService.logMetric(
                      `Page Load : ${window.location.href}`,
                      loadTime,
                      window.location
                  );              
              }
          })
        changeDetector.markForCheck();
      }
      if (event instanceof NavigationStart) {
      }
    });
    this.loaderService.isLoading.subscribe(v => {
      if (v) {
        if (!isNaN((<any>window).lastCall - (<any>window).firstCall)) {
          this.myMonitoringService.logMetric(
            window.location.href,
            (<any>window).lastCall - (<any>window).firstCall,
            window.location
          );
        }
        delete (<any>window).firstCall;
        delete (<any>window).lastCall;
        delete (<any>window).visibleLoader;
        delete (<any>window).openedScreenLoaders;
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    let array = ['Documents', 'Audit Log', 'Email Log', 'Main Page'];
    let findElement = array.find(function(element) {
      return element == targetElement.innerText;
    });
    if (findElement) {
      delete (<any>window).openedScreenLoaders;
    }
  }
}
