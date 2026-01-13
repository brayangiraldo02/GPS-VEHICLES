import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'tablas',
        loadChildren: () => import('./modules/tables/tables-module').then((m) => m.TablesModule),
      },
      {
        path: 'inventarios',
        loadChildren: () =>
          import('./modules/inventory/inventory-module').then((m) => m.InventoryModule),
      },
      {
        path: 'facturacion',
        loadChildren: () => import('./modules/billing/billing-module').then((m) => m.BillingModule),
      },
      {
        path: 'cartera',
        loadChildren: () =>
          import('./modules/portfolio/portfolio-module').then((m) => m.PortfolioModule),
      },
      {
        path: 'inspecciones',
        loadChildren: () =>
          import('./modules/inspections/inspections-module').then((m) => m.InspectionsModule),
      },
      {
        path: 'utilidades',
        loadChildren: () =>
          import('./modules/utilities/utilities-module').then((m) => m.UtilitiesModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
