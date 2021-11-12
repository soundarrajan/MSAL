import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdalGuard } from 'adal-angular-wrapper';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { AuthenticationGuard } from '@shiptech/core/guards/authentication.guard';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './service/interceptor.service';
import { BootstrapResolver } from './resolver/bootstrap-resolver';
import { MsalGuard } from '@azure/msal-angular';
import { environment } from '@shiptech/environment';

console.log(environment.useAdal);
const routes: Routes = environment.useAdal
  ? [
      {
        path: '',
        component: LayoutMainComponent,
        pathMatch: 'full',
        data: {
          title: 'Shiptech'
        }
      },
      {
        path: '',
        data: {
          breadcrumb: 'Delivery',
          breadcrumbUrl: '/#/delivery',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.QuantityControl,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/quantity-control').then(
                m => m.QuantityControlModule
              )
          },
          {
            path: KnownPrimaryRoutes.EmailTemplateEditor,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/ete').then(m => m.EteModule)
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Delivery List',
          breadcrumbUrl: '/#/delivery',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Delivery,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/delivery').then(m => m.DeliveryModule)
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Contract List',
          breadcrumbUrl: '/#/contract',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Contract,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/contract').then(m => m.ContractModule)
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Control Tower List',
          breadcrumbUrl: '/v2/control-tower',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.ControlTower,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/control-tower').then(
                m => m.ControlTowerModule
              )
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Invoice List',
          breadcrumbUrl: '/#/invoice',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Invoices,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/invoice').then(m => m.InvoiceModule)
          }
        ]
      },
      {
        path: KnownPrimaryRoutes.LazyLoad,
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@shiptech/feature/lazy-load-poc').then(
            m => m.LazyLoadPocModule
          )
      },
      {
        path: '',
        data: {
          breadcrumb: 'Smart',
          breadcrumbUrl: '/#/smart',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Smart,
            canActivate: [AuthenticationGuard],
            loadChildren: () =>
              import('@shiptech/feature/smart').then(m => m.SmartModule)
          }
        ]
      },
      { path: '**', redirectTo: '' }
    ]
  : [
      {
        path: '',
        component: LayoutMainComponent,
        pathMatch: 'full',
        data: {
          title: 'Shiptech'
        },
        canActivate: [MsalGuard],
        resolve: {
          data: BootstrapResolver
        }
      },
      {
        path: '',
        data: {
          breadcrumb: 'Delivery',
          breadcrumbUrl: '/#/delivery',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.QuantityControl,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/quantity-control').then(
                m => m.QuantityControlModule
              ),
            resolve: {
              data: BootstrapResolver
            }
          },
          {
            path: KnownPrimaryRoutes.EmailTemplateEditor,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/ete').then(m => m.EteModule),
            resolve: {
              data: BootstrapResolver
            }
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Delivery List',
          breadcrumbUrl: '/#/delivery',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Delivery,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/delivery').then(m => m.DeliveryModule),
            resolve: {
              data: BootstrapResolver
            }
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Contract List',
          breadcrumbUrl: '/#/contract',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Contract,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/contract').then(m => m.ContractModule),
            resolve: {
              data: BootstrapResolver
            }
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Control Tower List',
          breadcrumbUrl: '/v2/control-tower',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.ControlTower,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/control-tower').then(
                m => m.ControlTowerModule
              ),
            resolve: {
              data: BootstrapResolver
            }
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Invoice List',
          breadcrumbUrl: '/#/invoice',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Invoices,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/invoice').then(m => m.InvoiceModule),
            resolve: {
              data: BootstrapResolver
            }
          }
        ]
      },
      {
        path: KnownPrimaryRoutes.LazyLoad,
        canActivate: [MsalGuard],
        loadChildren: () =>
          import('@shiptech/feature/lazy-load-poc').then(
            m => m.LazyLoadPocModule
          ),
        resolve: {
          data: BootstrapResolver
        }
      },
      {
        path: '',
        data: {
          breadcrumb: 'Smart',
          breadcrumbUrl: '/#/smart',
          breadcrumbIcon: 'fa fa-home'
        },
        children: [
          {
            path: KnownPrimaryRoutes.Smart,
            canActivate: [MsalGuard],
            loadChildren: () =>
              import('@shiptech/feature/smart').then(m => m.SmartModule),
            resolve: {
              data: BootstrapResolver
            }
          }
        ]
      },
      { path: '**', redirectTo: '' }
    ];

@NgModule({
  providers: [
    AdalGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
