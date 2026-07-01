import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesManagersComponent } from './sales-managers.component';


const routes: Routes = [
    {
        path: '',
        component: SalesManagersComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./tabs/manager-stat/manager-stat.component').then(m => m.ManagerStatComponent)
            },
            {
                path: 'complaints',
                loadComponent: () => import('./tabs/incidents/incidents.component').then(m => m.IncidentsComponent)
            },
            {
                path: 'statistics-complaints',
                loadComponent: () => import('./tabs/incidents-dashboard/incidents-dashboard.component').then(m => m.IncidentsDashboardComponent)
            },
            {
                path: 'niche',
                loadComponent: () => import('./tabs/niche/niche.component').then(m => m.NicheComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesManagersRoutingModule { }
