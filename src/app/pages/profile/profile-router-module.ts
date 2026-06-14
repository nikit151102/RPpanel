import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'logistics',
        loadChildren: () =>
          import('./sections/logistics/drivers-routing.module')
            .then(m => m.DriverComponentRoutingModule),
        // data: { permission: 'Рассылка' }
      },
      {
        path: 'managers',
        loadChildren: () =>
          import('./sections/sales-managers/sales-managers-router-module')
            .then(m => m.SalesManagersRoutingModule),
        // data: { permission: 'Рассылка' }
      },
      {
        path: 'hr',
        loadChildren: () =>
          import('./sections/hr/hr-routing.module')
            .then(m => m.HrComponentRoutingModule),
        // data: { permission: 'Рассылка' }
      },
      {
        path: 'shops',
        loadChildren: () =>
          import('./sections/shops/shops-routing.module')
            .then(m => m.ShopsComponentRoutingModule),
        // data: { permission: 'Рассылка' }
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./sections/company/company-routing.module')
            .then(m => m.CompanyRoutingModule),
        // data: { permission: 'Рассылка' }
      },
      {
        path: 'superAdmin',
        loadChildren: () =>
          import('./sections/super-admin/super-admin-routing.module')
            .then(m => m.SuperAdminRoutingModule),
        // data: { permission: 'Рассылка' }
      },

    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
