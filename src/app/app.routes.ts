import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
    {
        path: '', component: AuthComponent
    },
    {
        path: 'resultsTest/:id', loadChildren: () => import('./results-test/results-test.module').then(m => m.ResultsTestModule),
    },
    {
        path: 'order/:id', loadComponent: () => import('./additional_pages/site-order/site-order.component').then(m => m.SiteOrderComponent),
    },
    {
        path: 'wholesaleOrder/:id', loadComponent: () => import('./additional_pages/wholesale-order/wholesale-order.component').then(m => m.WholesaleOrderComponent),
    },
    {
        path: 'profile', loadChildren: () => import('./pages/profile/profile-router-module').then(m => m.ProfileRoutingModule),
    }
];
